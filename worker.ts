// worker.ts — Point d'entrée Cloudflare Worker
//
// Rôle :
//   - /api/keystatic/* → traité par le handler Keystatic (OAuth GitHub, lecture/écriture)
//   - Tout le reste    → servi depuis les fichiers statiques dans _site/
//
// Le binding ASSETS est automatiquement créé par Cloudflare quand
// [assets] est défini dans wrangler.toml.

import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic'
import config from './keystatic.config'

interface Env {
  ASSETS:                         { fetch(r: Request): Promise<Response> }
  KEYSTATIC_GITHUB_CLIENT_ID:     string
  KEYSTATIC_GITHUB_CLIENT_SECRET: string
  KEYSTATIC_SECRET:               string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url)

    // ── Debug endpoints (à supprimer après diagnostic) ────────────────────
    if (pathname === '/api/keystatic/debug') {
      return new Response(JSON.stringify({
        hasClientId:     !!env.KEYSTATIC_GITHUB_CLIENT_ID,
        hasClientSecret: !!env.KEYSTATIC_GITHUB_CLIENT_SECRET,
        hasSecret:       !!env.KEYSTATIC_SECRET,
        nodeEnv:         typeof process !== 'undefined' ? process.env.NODE_ENV : 'process_undefined',
        makeHandlerType: typeof makeGenericAPIRouteHandler,
      }, null, 2), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Simule un appel login et retourne l'erreur exacte en HTTP 200 (lisible)
    if (pathname === '/api/keystatic/debug-login') {
      try {
        const handler = makeGenericAPIRouteHandler({
          config,
          clientId:     env.KEYSTATIC_GITHUB_CLIENT_ID,
          clientSecret: env.KEYSTATIC_GITHUB_CLIENT_SECRET,
          secret:       env.KEYSTATIC_SECRET,
        })
        const loginReq = new Request(
          new URL('/api/keystatic/github/login', request.url).toString(),
          { method: 'GET' }
        )
        const res = await handler(loginReq)
        return new Response(JSON.stringify({
          ok:      true,
          status:  res.status,
          headers: Object.fromEntries(res.headers.entries()),
          body:    await res.text(),
        }, null, 2), { headers: { 'Content-Type': 'application/json' } })
      } catch (e: unknown) {
        const err = e instanceof Error ? e : new Error(String(e))
        return new Response(JSON.stringify({
          ok:      false,
          name:    err.name,
          message: err.message,
          stack:   err.stack,
        }, null, 2), { headers: { 'Content-Type': 'application/json' } })
      }
    }

    // ── Debug: intercepter le callback OAuth pour voir la réponse brute ──
    if (pathname === '/api/keystatic/github/oauth/callback') {
      try {
        const handler = makeGenericAPIRouteHandler({
          config,
          clientId:     env.KEYSTATIC_GITHUB_CLIENT_ID,
          clientSecret: env.KEYSTATIC_GITHUB_CLIENT_SECRET,
          secret:       env.KEYSTATIC_SECRET,
        })
        const ksRes = await handler(request)
        const isStdResponse = ksRes instanceof Response

        let debugHeaders: unknown = null
        let debugBody: string | null = null

        if (isStdResponse) {
          const res = ksRes as Response
          debugHeaders = Object.fromEntries(res.headers.entries())
          debugBody = await res.text()
        } else {
          debugHeaders = ksRes.headers
          debugBody = typeof ksRes.body === 'string' ? ksRes.body : null
        }

        return new Response(JSON.stringify({
          _debug:        'Intercepted OAuth callback response from Keystatic',
          isResponse:    isStdResponse,
          status:        ksRes.status,
          headersType:   typeof ksRes.headers,
          isArrayHeaders: Array.isArray(ksRes.headers),
          headers:       debugHeaders,
          bodyPreview:   debugBody?.slice(0, 1000) ?? null,
          requestCookies: request.headers.get('cookie'),
        }, null, 2), {
          headers: { 'Content-Type': 'application/json' },
        })
      } catch (err: unknown) {
        const e = err instanceof Error ? err : new Error(String(err))
        return new Response(JSON.stringify({
          _debug: 'OAuth callback THREW an error',
          name:    e.name,
          message: e.message,
          stack:   e.stack,
        }, null, 2), {
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }

    // ── Keystatic API ───────────────────────────────────────────────────
    if (pathname.startsWith('/api/keystatic/')) {
      try {
        const handler = makeGenericAPIRouteHandler({
          config,
          clientId:     env.KEYSTATIC_GITHUB_CLIENT_ID,
          clientSecret: env.KEYSTATIC_GITHUB_CLIENT_SECRET,
          secret:       env.KEYSTATIC_SECRET,
        })
        // makeGenericAPIRouteHandler retourne un KeystaticResponse (objet plain),
        // pas un Response standard — conversion obligatoire pour Cloudflare Workers.
        const ksRes = await handler(request)

        // Si c'est déjà une Response standard, on la retourne directement
        if (ksRes instanceof Response) {
          return ksRes
        }

        // Sinon, convertir le KeystaticResponse en Response standard
        // ksRes.headers peut être un array de tuples, un iterable, ou un objet plain
        const headers = new Headers()
        if (ksRes.headers) {
          if (Symbol.iterator in Object(ksRes.headers)) {
            for (const [k, v] of ksRes.headers as Iterable<[string, string]>) {
              headers.append(k, v)
            }
          } else if (typeof ksRes.headers === 'object') {
            for (const [k, v] of Object.entries(ksRes.headers)) {
              headers.append(k, String(v))
            }
          }
        }
        return new Response(ksRes.body ?? null, {
          status:  ksRes.status,
          headers,
        })
      } catch (err: unknown) {
        const message = err instanceof Error
          ? `${err.name}: ${err.message}\n${err.stack ?? ''}`
          : String(err)
        return new Response(JSON.stringify({ error: message }, null, 2), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }

    // ── Fichiers statiques (Eleventy + Vite → _site/) ───────────────────
    return env.ASSETS.fetch(request)
  },
}
