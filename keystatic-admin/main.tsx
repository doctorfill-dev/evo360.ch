// keystatic-admin/main.tsx
// Point d'entrée React de l'interface d'administration Keystatic.
// Bundlé par Vite → _site/keystatic/index.html

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Keystatic } from '@keystatic/core/ui'
import config from '../keystatic.config'

// @ts-ignore //todo : check error
ReactDOM.createRoot(document.getElementById('keystatic-root')!).render(
  <React.StrictMode>
    <Keystatic config={config} />
  </React.StrictMode>
)
