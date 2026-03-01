// keystatic-admin/main.tsx
// Point d'entrée React de l'interface d'administration Keystatic.
// Bundlé par Vite → _site/keystatic/index.html

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Keystatic } from '@keystatic/core/ui'

ReactDOM.createRoot(document.getElementById('keystatic-root')!).render(
  <React.StrictMode>
    <Keystatic />
  </React.StrictMode>
)
