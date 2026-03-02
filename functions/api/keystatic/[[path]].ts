// functions/api/keystatic/[[path]].ts
// Cloudflare Pages Function — gère toutes les routes /api/keystatic/*
// (OAuth GitHub, lecture/écriture de fichiers via GitHub API)
//
// Variables d'environnement requises dans Cloudflare Pages Dashboard
// → Settings → Environment Variables :
//   KEYSTATIC_GITHUB_CLIENT_ID     → ID de l'OAuth App GitHub
//   KEYSTATIC_GITHUB_CLIENT_SECRET → Secret de l'OAuth App GitHub
//   KEYSTATIC_SECRET               → Chaîne aléatoire ≥ 32 chars (cookie signing)

import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic'
import config from '../../../keystatic.config'

interface Env {
  KEYSTATIC_GITHUB_CLIENT_ID:     string
  KEYSTATIC_GITHUB_CLIENT_SECRET: string
  KEYSTATIC_SECRET:               string
}

// @ts-ignore // todo : check the error
export const onRequest: PagesFunction<Env> = (context) => {
  // En production CF Pages, les variables d'environnement ne sont pas dans
  // process.env mais dans context.env — on les passe explicitement.
  const handler = makeGenericAPIRouteHandler({
    config,
    clientId:     context.env.KEYSTATIC_GITHUB_CLIENT_ID,
    clientSecret: context.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
    secret:       context.env.KEYSTATIC_SECRET,
  })

  return handler(context.request)
}
