// keystatic.config.ts
// Schéma de contenu pour l'admin UI Keystatic.
// Chaque "singleton" correspond à un fichier JSON dans src/_data/.
// Le schéma reproduit exactement la structure de home.json.

import { config, fields, singleton } from '@keystatic/core'

export default config({
  // Toujours GitHub — le storage 'local' ne fonctionne pas dans Cloudflare Workers
  // (pas d'accès filesystem). Pour le dev local, utiliser les credentials OAuth.
  storage: {
    kind: 'github',
    repo: {
      owner: 'doctorfill-dev',
      name:  'evo360.ch',
    },
  },

  ui: {
    brand: { name: 'evo360 — Admin' },
  },

  singletons: {
    home: singleton({
      label:  "Page d'accueil",
      path:   'src/_data/home',
      format: { data: 'json' },

      schema: {

        // ── Coordonnées ─────────────────────────────────────────────────
        site: fields.object(
          {
            name:    fields.text({ label: 'Nom du site' }),
            phone:   fields.text({ label: 'Téléphone' }),
            email:   fields.text({ label: 'Email' }),
            address: fields.text({ label: 'Adresse', multiline: true }),
            access:  fields.text({ label: 'Accès (transports)', multiline: true }),
          },
          { label: 'Coordonnées du centre' }
        ),

        // ── Navigation ──────────────────────────────────────────────────
        nav: fields.object(
          {
            links: fields.array(
              fields.object(
                {
                  label: fields.text({ label: 'Libellé' }),
                  url:   fields.text({ label: 'Ancre / URL' }),
                },
                { label: 'Lien' }
              ),
              {
                label:     'Liens de navigation',
                itemLabel: (props) => props.fields.label.value || 'Lien',
              }
            ),
            cta: fields.object(
              {
                label: fields.text({ label: 'Texte du bouton' }),
                url:   fields.text({ label: 'Lien du bouton' }),
              },
              { label: 'Bouton CTA header' }
            ),
          },
          { label: 'Navigation' }
        ),

        // ── Section Hero ─────────────────────────────────────────────────
        hero: fields.object(
          {
            badge:       fields.text({ label: 'Badge (pilule en haut)' }),
            title:       fields.text({ label: 'Titre — HTML autorisé (<span class="text-indigo">…</span>)' }),
            description: fields.text({ label: 'Description', multiline: true }),
            cta_primary: fields.object(
              {
                label: fields.text({ label: 'Texte' }),
                url:   fields.text({ label: 'Lien' }),
              },
              { label: 'Bouton principal' }
            ),
            cta_secondary: fields.object(
              {
                label: fields.text({ label: 'Texte' }),
                url:   fields.text({ label: 'Lien' }),
              },
              { label: 'Bouton secondaire' }
            ),
            stats: fields.array(
              fields.object(
                {
                  value: fields.text({ label: 'Valeur (ex: 15+)' }),
                  label: fields.text({ label: 'Libellé (ex: Experts)' }),
                },
                { label: 'Statistique' }
              ),
              {
                label:     'Statistiques',
                itemLabel: (props) => props.fields.value.value || 'Stat',
              }
            ),
          },
          { label: 'Section Hero' }
        ),

        // ── Section Notre approche ───────────────────────────────────────
        about: fields.object(
          {
            title:     fields.text({ label: 'Titre — HTML autorisé (<span class="accent">…</span>)' }),
            lead:      fields.text({ label: 'Accroche (gras)', multiline: true }),
            body_text: fields.text({ label: 'Corps du texte', multiline: true }),
            quote:     fields.text({ label: 'Citation (encadrée)', multiline: true }),
          },
          { label: "Section Notre approche" }
        ),

        // ── Section Services ─────────────────────────────────────────────
        services: fields.object(
          {
            items: fields.array(
              fields.object(
                {
                  id:          fields.text({ label: 'Numéro (01, 02…)' }),
                  title:       fields.text({ label: 'Titre' }),
                  description: fields.text({ label: 'Description', multiline: true }),
                },
                { label: 'Service' }
              ),
              {
                label:     'Services',
                itemLabel: (props) => props.fields.title.value || 'Service',
              }
            ),
          },
          { label: 'Section Services' }
        ),

        // ── Section Témoignages ──────────────────────────────────────────
        testimonials: fields.object(
          {
            items: fields.array(
              fields.object(
                {
                  name:    fields.text({ label: 'Prénom' }),
                  age:     fields.text({ label: 'Âge (ex: 35 ans)' }),
                  initial: fields.text({ label: 'Initiale (1 lettre)' }),
                  color:   fields.text({ label: 'Couleur avatar (hex, ex: #4622CC)' }),
                  text:    fields.text({ label: 'Témoignage', multiline: true }),
                  rotate:  fields.number({ label: 'Rotation carte (°, ex: -1 ou 1)' }),
                },
                { label: 'Témoignage' }
              ),
              {
                label:     'Témoignages',
                itemLabel: (props) => props.fields.name.value || 'Témoignage',
              }
            ),
          },
          { label: 'Section Témoignages' }
        ),

        // ── Section CTA ──────────────────────────────────────────────────
        cta: fields.object(
          {
            title:     fields.text({ label: 'Titre — HTML autorisé (<span class="text-white">…</span>)' }),
            text:      fields.text({ label: 'Texte sous le titre', multiline: true }),
            btn_label: fields.text({ label: 'Texte bouton principal' }),
            btn_url:   fields.text({ label: 'Lien bouton principal' }),
            phone:     fields.text({ label: 'Téléphone affiché (bouton secondaire)' }),
          },
          { label: 'Section CTA' }
        ),

        // ── Section Contact ──────────────────────────────────────────────
        contact: fields.object(
          {
            title:       fields.text({ label: 'Titre — HTML autorisé (<span class="accent">…</span>)' }),
            description: fields.text({ label: 'Description', multiline: true }),
          },
          { label: 'Section Contact' }
        ),

        // ── Footer ───────────────────────────────────────────────────────
        footer: fields.object(
          {
            description: fields.text({ label: 'Texte descriptif', multiline: true }),
            social: fields.array(
              fields.object(
                {
                  label: fields.text({ label: 'Réseau (ex: Instagram)' }),
                  url:   fields.text({ label: 'URL du profil' }),
                },
                { label: 'Réseau social' }
              ),
              {
                label:     'Réseaux sociaux',
                itemLabel: (props) => props.fields.label.value || 'Réseau',
              }
            ),
          },
          { label: 'Footer' }
        ),

      }, // fin schema
    }),  // fin singleton home
  },     // fin singletons
})
