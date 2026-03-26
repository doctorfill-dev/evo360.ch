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

// ── Redirections permanentes (anciens slugs → nouveaux slugs) ────────────────
// Gérées ici plutôt que dans _redirects pour garantir leur exécution
// avant que le binding ASSETS ne lève une exception sur des URLs inconnues.
const REDIRECTS: Record<string, string> = {
  '/entreprise-institutions':   '/services/entreprises/',
  '/notre-approche':            '/about/',
  '/services/fitness-evo360':   '/services/fitness/',
  '/votre-objectif':            '/services/coaching/',
  '/notre-equipe':              '/about/',
  '/services/red-light-copy':   '/services/red-light-therapy/',
}

async function serve404(env: Env, request: Request): Promise<Response> {
  try {
    const notFoundUrl = new URL('/404.html', request.url)
    const res = await env.ASSETS.fetch(new Request(notFoundUrl.toString()))
    return new Response(res.body, { status: 404, headers: res.headers })
  } catch {
    return new Response(
      '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>404 – Page introuvable</title></head>' +
      '<body><h1>Page introuvable</h1><p><a href="/">Retour à l\'accueil</a></p></body></html>',
      { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    )
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url)

    // ── Redirections 301 ─────────────────────────────────────────────────────
    const cleanPath = pathname.endsWith('/') && pathname !== '/'
      ? pathname.slice(0, -1)
      : pathname
    const redirectTarget = REDIRECTS[cleanPath] ?? REDIRECTS[pathname]
    if (redirectTarget) {
      return Response.redirect(new URL(redirectTarget, request.url).toString(), 301)
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
        // Keystatic construit le redirect_uri OAuth depuis reqUrl.origin.
        // Si la requête arrive via un domaine alternatif (*.workers.dev, www.…),
        // on force l'origin canonique pour que le redirect_uri corresponde
        // exactement à ce qui est enregistré dans la GitHub OAuth App.
        const reqUrl = new URL(request.url)
        const canonicalRequest =
          reqUrl.hostname === 'evo360.ch'
            ? request
            : new Request(
                new URL(request.url.replace(reqUrl.origin, 'https://evo360.ch')).toString(),
                request,
              )
        // makeGenericAPIRouteHandler retourne un KeystaticResponse (objet plain),
        // pas un Response standard — conversion obligatoire pour Cloudflare Workers.
        const ksRes = await handler(canonicalRequest)

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
        // @ts-ignore // todo : check the error
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
    let response: Response
    try {
      response = await env.ASSETS.fetch(request)
    } catch {
      return serve404(env, request)
    }

    // ── Fallback 404 personnalisé ────────────────────────────────────────
    if (response.status === 404) {
      // /keystatic/* → SPA admin (on sert keystatic/index.html)
      if (pathname.startsWith('/keystatic')) {
        const spaUrl = new URL('/keystatic/index.html', request.url)
        return env.ASSETS.fetch(new Request(spaUrl, request))
      }
      return serve404(env, request)
    }

    return response
  },
}
