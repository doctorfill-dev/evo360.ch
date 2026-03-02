// vite.config.ts
// Vite bundle l'interface d'administration Keystatic.
// root: 'keystatic-admin' → Vite cherche l'index.html dans keystatic-admin/
// outDir absolu           → écrit dans _site/keystatic/

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore // todo : check the error
import { resolve } from 'path'

export default defineConfig({
  // Dossier source de l'admin UI
  root: 'keystatic-admin',

  // IMPORTANT : les assets générés seront référencés depuis /keystatic/
  // sans ça, Vite génère /assets/... au lieu de /keystatic/assets/...
  base: '/keystatic/',

  plugins: [react()],

  build: {
    // Chemin absolu : évite la confusion avec la root Vite
    // @ts-ignore // todo : check the error
    outDir:      resolve(__dirname, '_site/keystatic'),
    emptyOutDir: true,
  },

  server: {
    port: 3001,
  },
})
