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

    // ── Keystatic API ───────────────────────────────────────────────────
    if (pathname.startsWith('/api/keystatic/')) {
      const handler = makeGenericAPIRouteHandler({
        config,
        clientId:     env.KEYSTATIC_GITHUB_CLIENT_ID,
        clientSecret: env.KEYSTATIC_GITHUB_CLIENT_SECRET,
        secret:       env.KEYSTATIC_SECRET,
      })
      return handler(request)
    }

    // ── Fichiers statiques (Eleventy + Vite → _site/) ───────────────────
    return env.ASSETS.fetch(request)
  },
}
