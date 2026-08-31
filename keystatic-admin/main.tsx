// keystatic-admin/main.tsx
// Point d'entrée React de l'interface d'administration Keystatic.
// Bundlé par Vite → _site/keystatic/index.html

import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { createPortal } from 'react-dom'
import { Keystatic } from '@keystatic/core/ui'
import config from '../keystatic.config'

const homeSections = [
  'Barre promotionnelle',
  'Coordonnées & SEO',
  'Navigation',
  'Section Hero',
  'Section Notre approche',
  'Partenaire Médical (SportMed)',
  'Section Tarifs',
  'Section Témoignages',
  'Section Équipe',
  'Section CTA',
  'Section Instagram',
  'Section Contact',
  'Footer',
]

/**
 * Adds shortcuts to the existing Keystatic sidebar without changing the
 * content schema or its storage format. Keystatic does not expose a slot for
 * nested fields in its native navigation, so this intentionally stays small
 * and only relies on accessible labels rendered by the editor.
 */
function HomeSectionNavigation() {
  const [target, setTarget] = useState<HTMLElement | null>(null)
  const [isHomeEditor, setIsHomeEditor] = useState(false)

  useEffect(() => {
    const sync = () => {
      // Keystatic scopes the editor URL to the selected branch in GitHub
      // storage mode (e.g. /keystatic/branch/main/singleton/home).  Match
      // the stable end of the route so the shortcuts also work in local mode.
      const homeLink = document.querySelector<HTMLAnchorElement>(
        'nav a[href$="/singleton/home"]',
      )
      const sidebarList = homeLink?.closest('li')?.parentElement

      setTarget((current) => current === sidebarList ? current : sidebarList ?? null)
      setIsHomeEditor(window.location.pathname.endsWith('/singleton/home'))
    }

    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.body, { childList: true, subtree: true })
    window.addEventListener('popstate', sync)

    return () => {
      observer.disconnect()
      window.removeEventListener('popstate', sync)
    }
  }, [])

  const scrollToSection = (sectionName: string) => {
    const section = Array.from(
      document.querySelectorAll<HTMLElement>('main [role="group"]'),
    ).find((element) => {
      const labelId = element.getAttribute('aria-labelledby')
      return labelId && document.getElementById(labelId)?.textContent === sectionName
    })

    if (section) {
      // Match the editor's horizontal gutter so the section title is not
      // pressed against the top edge after a shortcut is used.
      section.style.scrollMarginTop = '32px'
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (!target || !isHomeEditor) return null

  return createPortal(
    <li style={{ margin: '6px 0 10px', paddingLeft: 12 }}>
      <div
        aria-label="Sections de la page d'accueil"
        style={{
          borderLeft: '1px solid rgba(255, 255, 255, 0.18)',
          display: 'grid',
          gap: 3,
          padding: '4px 0 4px 10px',
        }}
      >
        {homeSections.map((section) => (
          <button
            key={section}
            type="button"
            onClick={() => scrollToSection(section)}
            style={{
              background: 'transparent',
              border: 0,
              borderRadius: 4,
              color: 'rgb(185, 185, 185)',
              cursor: 'pointer',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontSize: 14,
              fontWeight: 400,
              lineHeight: '19.6px',
              outline: 'none',
              padding: '3px 6px',
              textAlign: 'left',
              width: '100%',
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.color = 'rgb(227, 227, 227)'
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.color = 'rgb(185, 185, 185)'
            }}
          >
            {section.replace(/^Section /, '')}
          </button>
        ))}
      </div>
    </li>,
    target,
  )
}

// @ts-ignore //todo : check error
ReactDOM.createRoot(document.getElementById('keystatic-root')!).render(
  <React.StrictMode>
    <Keystatic config={config} />
    <HomeSectionNavigation />
  </React.StrictMode>
)
