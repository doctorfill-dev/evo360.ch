// keystatic.config.ts
// Schéma de contenu pour l'admin UI Keystatic.
// Chaque "singleton" correspond à un fichier JSON dans src/_data/.
// Le schéma reproduit exactement la structure de home.json.

import { config, fields, singleton, collection } from '@keystatic/core'

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
    navigation: {
      'Page d\'accueil': ['home'],
      'Contenu': ['services', 'posts'],
    },
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
            img1: fields.text({ label: 'Image hero 1 (chemin)' }),
            img2: fields.text({ label: 'Image hero 2 (chemin)' }),
            img3: fields.text({ label: 'Image hero 3 (chemin)' }),
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
            image:     fields.text({ label: 'Image (chemin)' }),
          },
          { label: "Section Notre approche" }
        ),

        // ── Section SportMed360 (Partenaire) ─────────────────────────────
        sportmed: fields.object(
          {
            title:       fields.text({ label: 'Titre (ex: Notre partenaire médical)' }),
            description: fields.text({ label: 'Texte explicatif (neutre)', multiline: true }),
            link_text:   fields.text({ label: 'Texte du lien' }),
            link_url:    fields.text({ label: 'URL vers sportmed360.ch' }),
            logo:        fields.text({ label: 'Logo SportMed (chemin)' }),
          },
          { label: 'Partenaire Médical (SportMed)' }
        ),

        // ── Section Services ─────────────────────────────────────────────
        services: fields.object(
          {
            items: fields.array(
              fields.object({
                id:          fields.text({ label: 'Numéro (ex: 01)' }),
                title:       fields.text({ label: 'Titre du service' }),
                description: fields.text({ label: 'Description courte', multiline: true }),
                image:       fields.text({ label: 'Image (chemin)' }),
                url:         fields.text({ label: 'Lien vers la page détaillée' }),
              }),
              {
                label:     'Services affichés sur la homepage',
                itemLabel: (props) => props.fields.title.value || 'Service',
              }
            ),
          },
          { label: 'Section Services' }
        ),

        // ── Section Tarifs & Abonnements ─────────────────────────────────
        pricing: fields.object(
          {
            title:       fields.text({ label: 'Titre (ex: Choisissez votre formule)' }),
            description: fields.text({ label: 'Description', multiline: true }),
            plans: fields.array(
              fields.object({
                name:        fields.text({ label: 'Nom de l\'offre' }),
                price:       fields.text({ label: 'Prix (ex: 89.-)' }),
                period:      fields.text({ label: 'Période (ex: / mois)' }),
                description: fields.text({ label: 'Résumé court' }),
                features:    fields.array(fields.text({ label: 'Bénéfice inclus' }), {
                  label: 'Liste des prestations incluses',
                  itemLabel: (props) => props.value || 'Prestation',
                }),
                cta_label:   fields.text({ label: 'Texte du bouton' }),
                cta_url:     fields.text({ label: 'Lien du bouton' }),
                highlight:   fields.checkbox({ label: 'Mettre en avant (Badge "Populaire")' }),
              }),
              {
                label: 'Plans d\'abonnements',
                itemLabel: (props) => props.fields.name.value || 'Plan',
              }
            ),
          },
          { label: 'Section Tarifs' }
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

  collections: {
    // ── Collection Services (Pages détaillées) ────────────────────────
    services: collection({
      label: 'Services',
      slugField: 'title',
      path: 'src/services/*',
      format: { contentField: 'content' },
      schema: {
        title:       fields.slug({ name: { label: 'Titre du service' } }),
        order:       fields.number({ label: 'Ordre d\'affichage (1, 2...)' }),
        summary:     fields.text({ label: 'Résumé (pour la carte accueil)', multiline: true }),
        cover_image: fields.image({
          label: 'Image de couverture',
          directory: 'src/assets/img/services',
          publicPath: '/assets/img/services/'
        }),
        icon:        fields.text({ label: 'Icône (emoji ou classe CSS)' }),
        content:     fields.document({
          label: 'Contenu détaillé',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'src/assets/img/content',
            publicPath: '/assets/img/content/'
          },
        }),
      },
    }),

    // ── Collection Blog (Articles) ────────────────────────────────────
    posts: collection({
      label: 'Blog & Conseils',
      slugField: 'title',
      path: 'src/blog/*',
      format: { contentField: 'content' },
      schema: {
        title:       fields.slug({ name: { label: 'Titre de l\'article' } }),
        publishedDate: fields.date({ label: 'Date de publication' }),
        author:      fields.text({ label: 'Auteur' }),
        summary:     fields.text({ label: 'Résumé (accroche)', multiline: true }),
        cover_image: fields.image({
          label: 'Image principale',
          directory: 'src/assets/img/blog',
          publicPath: '/assets/img/blog/'
        }),
        content:     fields.document({
          label: 'Contenu de l\'article',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'src/assets/img/content',
            publicPath: '/assets/img/content/'
          },
        }),
      },
    }),
  },
})
