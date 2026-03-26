// keystatic.config.ts
// Schéma de contenu pour l'admin UI Keystatic.
// Chaque "singleton" correspond à un fichier JSON dans src/_data/.
// Le schéma reproduit exactement la structure de home.json.

import { config, fields, singleton, collection } from '@keystatic/core'

// ── Storage mode ────────────────────────────────────────────────────────
// LOCAL  : `npm run dev:admin` → Vite dev server, lit/écrit sur le disque
// GITHUB : production (Cloudflare Pages) → lit/écrit via l'API GitHub
//
// Ce fichier est importé dans 2 contextes :
//  1. Navigateur (admin React) — `process` n'existe pas, on utilise import.meta.env.DEV
//  2. Node.js (middleware API Vite) — import.meta.env n'existe pas, on utilise process.env
//
// @ts-ignore — import.meta.env est injecté par Vite dans le contexte navigateur
const isLocal =
  // Contexte navigateur (Vite remplace import.meta.env.DEV → true/false)
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV === true) ||
  // Contexte Node.js (middleware Vite, `process` existe)
  (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production' && !process.env.CF_PAGES)

const storage = isLocal
  ? ({ kind: 'local' } as const)
  : ({
      kind: 'github',
      repo: { owner: 'doctorfill-dev', name: 'evo360.ch' },
    } as const)

export default config({
  storage,

  ui: {
    brand: { name: 'evo360 — Admin' },
    navigation: {
      'Page d\'accueil': ['home'],
      'Contenu': ['services', 'posts'],
      'Médias': ['media'],
    },
  },

  singletons: {
    home: singleton({
      label:  "Page d'accueil",
      path:   'src/_data/home',
      format: { data: 'json' },

      schema: {

        // ── Section Blog (activation) ────────────────────────────────────
        blog: fields.object(
          {
            enabled: fields.checkbox({ label: 'Activer la section Blog / Publications', defaultValue: false }),
          },
          { label: 'Blog & Publications' }
        ),

        // ── Barre promotionnelle ──────────────────────────────────────────
        promo: fields.object(
          {
            enabled: fields.checkbox({ label: 'Afficher la barre promotionnelle', defaultValue: false }),
            text:    fields.text({ label: 'Texte de la promotion' }),
            link:    fields.text({ label: 'Lien (optionnel)' }),
          },
          { label: 'Barre promotionnelle' }
        ),

        // ── Coordonnées & SEO ──────────────────────────────────────────
        site: fields.object(
          {
            name:     fields.text({ label: 'Nom du site' }),
            url:      fields.text({ label: 'URL du site (ex: https://evo360.ch)', description: 'Utilisé pour les balises SEO (canonical, Open Graph)' }),
            phone:    fields.text({ label: 'Téléphone' }),
            email:    fields.text({ label: 'Email' }),
            address:  fields.text({ label: 'Adresse', multiline: true }),
            access:   fields.text({ label: 'Accès (transports)', multiline: true }),
            og_image: fields.image({
              label: 'Image Open Graph',
              directory: 'src/assets/img/services',
              publicPath: '/assets/img/services/',
            }),
          },
          { label: 'Coordonnées & SEO' }
        ),

        // ── Navigation ──────────────────────────────────────────────────
        nav: fields.object(
          {
            links: fields.array(
              fields.object(
                {
                  label: fields.text({ label: 'Libellé' }),
                  url:   fields.text({ label: 'Ancre / URL' }),
                  children: fields.array(
                    fields.object({
                      label: fields.text({ label: 'Libellé' }),
                      url:   fields.text({ label: 'URL' }),
                    }),
                    { label: 'Sous-liens (dropdown)', itemLabel: (props) => props.fields.label.value || 'Sous-lien' }
                  ),
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
            img1: fields.image({ label: 'Image hero 1', directory: 'src/assets/img/services', publicPath: '/assets/img/services/' }),
            img2: fields.image({ label: 'Image hero 2', directory: 'src/assets/img/services', publicPath: '/assets/img/services/' }),
            img3: fields.image({ label: 'Image hero 3', directory: 'src/assets/img/services', publicPath: '/assets/img/services/' }),
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
            title:        fields.text({ label: 'Titre — HTML autorisé (<span class="accent">…</span>)' }),
            lead:         fields.text({ label: 'Accroche (gras)', multiline: true }),
            body_text:    fields.text({ label: 'Corps du texte', multiline: true }),
            quote:        fields.text({ label: 'Citation (encadrée)', multiline: true }),
            quote_author: fields.text({ label: 'Auteur de la citation' }),
            image:        fields.image({ label: 'Image', directory: 'src/assets/img/lieu', publicPath: '/assets/img/lieu/' }),
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
            logo:        fields.image({ label: 'Logo SportMed', directory: 'src/assets/img', publicPath: '/assets/img/' }),
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
                image:       fields.image({ label: 'Image', directory: 'src/assets/img/services', publicPath: '/assets/img/services/' }),
                url:         fields.text({ label: 'Lien vers la page détaillée' }),
                coming_soon: fields.checkbox({ label: 'À venir (pas encore disponible)', defaultValue: false }),
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
                name:            fields.text({ label: 'Nom de l\'offre' }),
                price_months:    fields.text({ label: 'Prix mensuel (ex: 150.-)' }),
                period_months:   fields.text({ label: 'Période mensuel (ex: / mois)' }),
                price_onetime:   fields.text({ label: 'Prix en une fois (ex: 450.-)' }),
                period_onetime:  fields.text({ label: 'Période unique (ex: en une fois)' }),
                description:     fields.text({ label: 'Résumé court' }),
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
                  name:    fields.text({ label: 'Nom complet' }),
                  job:     fields.text({ label: 'Métier / Profession', description: 'Optionnel — laisser vide si non pertinent' }),
                  age:     fields.text({ label: 'Catégorie / Contexte (ex: F1 Academy)', description: 'Optionnel — laisser vide si non pertinent' }),
                  initial: fields.text({ label: 'Initiale (1 lettre)' }),
                  color:   fields.text({ label: 'Couleur avatar (hex, ex: #4622CC)' }),
                  text:    fields.text({ label: 'Témoignage', multiline: true }),
                  rotate:  fields.number({ label: 'Rotation carte (°, ex: -1 ou 1)' }),
                  source:  fields.text({ label: 'Source (ex: Google Reviews)' }),
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

        // ── Section Équipe ──────────────────────────────────────────────
        team: fields.object(
          {
            title:       fields.text({ label: 'Titre — HTML autorisé' }),
            description: fields.text({ label: 'Description', multiline: true }),
            members: fields.array(
              fields.object({
                name:    fields.text({ label: 'Nom complet' }),
                role:    fields.text({ label: 'Rôle / Poste' }),
                image:   fields.image({ label: 'Photo', directory: 'src/assets/img/team', publicPath: '/assets/img/team/' }),
                tagline: fields.text({ label: 'Accroche courte (affichée sur la carte)' }),
                diploma: fields.text({ label: 'Diplôme / Certification principale' }),
                bio:     fields.text({ label: 'Biographie (texte long)', multiline: true }),
              }),
              {
                label: 'Membres de l\'équipe',
                itemLabel: (props) => props.fields.name.value || 'Membre',
              }
            ),
            sportmed_note: fields.text({ label: 'Note SportMed (texte)' }),
            sportmed_link: fields.text({ label: 'Lien vers sportmed360.ch' }),
          },
          { label: 'Section Équipe' }
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

        // ── Section Instagram ────────────────────────────────────────────
        instagram: fields.object(
          {
            handle: fields.text({ label: 'Handle (ex: @evo360_swiss)' }),
            url:    fields.text({ label: 'URL du profil Instagram' }),
            posts: fields.array(
              fields.object({
                image: fields.image({
                  label: 'Image du post',
                  directory: 'src/assets/img/instagram',
                  publicPath: '/assets/img/instagram/',
                }),
                url: fields.text({ label: 'URL du post Instagram' }),
                alt: fields.text({ label: 'Texte alternatif (accessibilité)' }),
              }),
              {
                label:     'Posts Instagram affichés',
                itemLabel: (props) => props.fields.alt.value || 'Post',
              }
            ),
          },
          { label: 'Section Instagram' }
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

    // ── Médiathèque (upload d'images) ─────────────────────────────────
    // L'admin uploade ses images ici (drag & drop), puis les sélectionne
    // via le champ "Image" dans les collections (Services, Blog).
    media: singleton({
      label: 'Médiathèque',
      path: 'src/_data/media',
      format: { data: 'json' },

      schema: {
        images: fields.array(
          fields.object({
            name: fields.text({ label: 'Nom / description (pour s\'y retrouver)' }),
            file: fields.image({
              label: 'Image',
              directory: 'src/assets/img',
              publicPath: '/assets/img/',
            }),
          }),
          {
            label: 'Images du site',
            itemLabel: (props) => props.fields.name.value || 'Image sans nom',
          }
        ),
      },
    }),
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
          publicPath: '/assets/img/services/',
        }),
        icon:        fields.text({ label: 'Nom d\'icône Material Symbols (ex: search, fitness_center)' }),
        coming_soon: fields.checkbox({ label: 'À venir (pas encore disponible)', defaultValue: false }),
        hide:        fields.checkbox({ label: 'Masquer complètement ce service du site', defaultValue: false }),
        // ── Tarification ─────────────────────────────────────────────────
        // Deux formats possibles selon le service :
        //   • price + price_note  → tarif unique (ex: Check-Up 360)
        //   • prices[]            → grille tarifaire (ex: Coaching, Fitness)
        price: fields.text({ label: 'Prix unique (ex: CHF 50.-)', description: 'Utilisez ce champ OU la grille ci-dessous, pas les deux.' }),
        price_note: fields.text({ label: 'Note tarifaire (ex: Offert avec un abonnement fitness)' }),
        prices: fields.array(
          fields.object({
            label:  fields.text({ label: 'Libellé (ex: Coaching 1 séance)' }),
            amount: fields.text({ label: 'Montant (ex: CHF 90.-)' }),
          }),
          {
            label:     'Grille tarifaire',
            itemLabel: (props) => props.fields.label.value || 'Tarif',
          }
        ),
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
          publicPath: '/assets/img/blog/',
        }),
        instagram_embed: fields.text({
          label: 'Code Embed Instagram',
          description: 'Collez ici le code HTML (<blockquote>...<script>...) fourni par Instagram. Si rempli, le contenu ci-dessous sera ignoré sur la liste.',
          multiline: true,
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
