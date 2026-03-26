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
const REDIRECTS: Record<string, string> = {
  '/entreprise-institutions':   '/services/entreprises/',
  '/notre-approche':            '/about/',
  '/services/fitness-evo360':   '/services/fitness/',
  '/votre-objectif':            '/services/coaching/',
  '/notre-equipe':              '/about/',
  '/services/red-light-copy':   '/services/red-light-therapy/',
}

// ── Fallback 404 ─────────────────────────────────────────────────────────────
// Utilise fetch() global (subrequest HTTP) plutôt que env.ASSETS.fetch() :
// après un premier échec d'ASSETS, le binding peut être dans un état cassé.
// Le subrequest arrive dans une nouvelle invocation du Worker où ASSETS est sain.
// Le header x-internal-404 évite toute boucle infinie.
async function serve404(request: Request): Promise<Response> {
  if (request.headers.get('x-internal-404') === '1') {
    // Deuxième passage — retourner le HTML minimal pour éviter une boucle
    return new Response(
      '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">' +
      '<title>404 – Page introuvable</title></head><body>' +
      '<h1>Page introuvable</h1><p><a href="/">Retour à l\'accueil</a></p>' +
      '</body></html>',
      { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    )
  }
  try {
    const origin = new URL(request.url).origin
    const res = await fetch(`${origin}/404.html`, {
      headers: { 'x-internal-404': '1' },
    })
    return new Response(res.body, {
      status: 404,
      headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'text/html; charset=utf-8' },
    })
  } catch {
    return new Response(
      '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">' +
      '<title>404 – Page introuvable</title></head><body>' +
      '<h1>Page introuvable</h1><p><a href="/">Retour à l\'accueil</a></p>' +
      '</body></html>',
      { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    )
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const { pathname } = new URL(request.url)

      // ── Redirections 301 ───────────────────────────────────────────────────
      const cleanPath = pathname.endsWith('/') && pathname !== '/'
        ? pathname.slice(0, -1)
        : pathname
      const redirectTarget = REDIRECTS[cleanPath] ?? REDIRECTS[pathname]
      if (redirectTarget) {
        return Response.redirect(new URL(redirectTarget, request.url).toString(), 301)
      }

      // ── Keystatic API ──────────────────────────────────────────────────────
      if (pathname.startsWith('/api/keystatic/')) {
        try {
          const handler = makeGenericAPIRouteHandler({
            config,
            clientId:     env.KEYSTATIC_GITHUB_CLIENT_ID,
            clientSecret: env.KEYSTATIC_GITHUB_CLIENT_SECRET,
            secret:       env.KEYSTATIC_SECRET,
          })
          const reqUrl = new URL(request.url)
          const canonicalRequest =
            reqUrl.hostname === 'evo360.ch'
              ? request
              : new Request(
                  new URL(request.url.replace(reqUrl.origin, 'https://evo360.ch')).toString(),
                  request,
                )
          const ksRes = await handler(canonicalRequest)
          if (ksRes instanceof Response) return ksRes

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
          // @ts-ignore
          return new Response(ksRes.body ?? null, { status: ksRes.status, headers })
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

      // ── Fichiers statiques (Eleventy + Vite → _site/) ─────────────────────
      let response: Response
      try {
        response = await env.ASSETS.fetch(request)
      } catch {
        // env.ASSETS.fetch() a lancé une exception (fichier non trouvé ou état cassé)
        return serve404(request)
      }

      // ── SPA Keystatic ──────────────────────────────────────────────────────
      if (response.status === 404 && pathname.startsWith('/keystatic')) {
        try {
          const spaUrl = new URL('/keystatic/index.html', request.url)
          return await env.ASSETS.fetch(new Request(spaUrl, request))
        } catch {
          return serve404(request)
        }
      }

      // ── 404 personnalisé (ASSETS a retourné 404 au lieu de lancer) ─────────
      if (response.status === 404) {
        return serve404(request)
      }

      return response
    } catch {
      // Filet de sécurité absolu — empêche toute erreur 1101 Cloudflare
      return serve404(request)
    }
  },
}
