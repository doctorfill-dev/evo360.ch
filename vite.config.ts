// vite.config.ts
// Vite bundle l'interface d'administration Keystatic.
// root: 'keystatic-admin' → Vite cherche l'index.html dans keystatic-admin/
// outDir absolu           → écrit dans _site/keystatic/

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  // Dossier source de l'admin UI
  root: 'keystatic-admin',

  plugins: [react()],

  build: {
    // Chemin absolu : évite la confusion avec la root Vite
    outDir:      resolve(__dirname, '_site/keystatic'),
    emptyOutDir: true,
  },

  server: {
    port: 3001,
  },
})
