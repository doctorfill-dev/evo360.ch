# evo360.ch

Site web du centre evo360 — Performance & Bien-être, Neuchâtel.

---

## Stack technique

| Couche | Technologie | Version |
|---|---|---|
| Générateur de site statique | [Eleventy (11ty)](https://www.11ty.dev/) | 3.1.x |
| Templating | Nunjucks (`.njk`) + Markdoc (`.mdoc`) | — |
| CMS headless | [Keystatic](https://keystatic.com/) | 0.5.x |
| UI du CMS | React 18 + Vite 6 | — |
| Hébergement | Cloudflare Pages + Workers | — |
| Domaine / DNS | Cloudflare | — |
| Optimisation images | Sharp (`scripts/optimize-images.mjs`) | — |

Le site est **entièrement statique** : Eleventy compile les templates en HTML/CSS/JS purs. Il n'y a aucun serveur applicatif en production — uniquement des fichiers dans `_site/` servis par Cloudflare Pages.

---

## Structure du projet

```
evo360.ch/
│
├── src/                        # Sources Eleventy
│   ├── _data/
│   │   ├── home.json           # Toutes les données de la homepage (éditable via CMS)
│   │   └── media.json          # Médiathèque (upload d'images via CMS)
│   │
│   ├── _includes/
│   │   ├── layouts/
│   │   │   ├── base.njk        # Layout principal (HTML complet, SEO, scripts)
│   │   │   ├── service.njk     # Layout page service détaillée
│   │   │   ├── post.njk        # Layout article de blog
│   │   │   └── legal.njk       # Layout pages légales (mentions, confidentialité)
│   │   └── partials/           # Composants réutilisables (header, footer, sections…)
│   │
│   ├── services/               # Collection Keystatic — pages services
│   │   └── *.mdoc              # Un fichier par service (frontmatter + contenu Markdoc)
│   │
│   ├── blog/                   # Collection Keystatic — articles de blog
│   │   └── *.mdoc
│   │
│   ├── assets/
│   │   ├── css/style.css       # Feuille de style principale (minifiée au build)
│   │   ├── fonts/              # Polices self-hosted (Inter + Outfit, woff2)
│   │   ├── img/                # Images optimisées (webp + srcset)
│   │   └── js/main.js          # JS client (cookie consent, GA, menu mobile)
│   │
│   ├── index.njk               # Page d'accueil
│   ├── about.njk               # Page "À propos"
│   ├── tarifs.njk              # Page Tarifs
│   ├── mentions-legales.njk    # Mentions légales
│   ├── confidentialite.njk     # Politique de confidentialité
│   ├── robots.njk              # robots.txt
│   └── sitemap.njk             # sitemap.xml
│
├── keystatic.config.ts         # Schéma CMS (source de vérité des champs éditables)
├── keystatic-admin/            # App React Keystatic (compilée par Vite → _site/keystatic/)
├── eleventy.config.js          # Configuration Eleventy (filtres, passthrough, extensions)
├── vite.config.ts              # Configuration Vite (dev admin + build admin)
├── worker.ts                   # Cloudflare Worker (routage API Keystatic ↔ assets statiques)
├── wrangler.toml               # Configuration Cloudflare Workers/Pages
├── scripts/
│   └── optimize-images.mjs     # Script de redimensionnement/conversion des images
└── _site/                      # Sortie de build (gitignored) → déployé sur Cloudflare
```

---

## Commandes

```bash
# Installer les dépendances
npm install

# Développement site (port 8080) — rechargement automatique
npm run dev

# Développement CMS admin (port 3001) — nécessite npm run dev en parallèle
npm run dev:admin

# Build complet (site + admin CMS)
npm run build

# Build site uniquement (sans CMS)
npm run build:site

# Optimiser et redimensionner les images
npm run resize
```

---

## Comment fonctionne le site

### Flux de build

```
src/ (Nunjucks + Markdoc + JSON)
        ↓  Eleventy
_site/  (HTML + CSS + JS + Assets)
        ↓  Vite (pour le CMS uniquement)
_site/keystatic/  (React app compilée)
        ↓  Cloudflare Pages
Production (evo360.ch)
```

### Données

Toutes les données de la homepage sont centralisées dans `src/_data/home.json`. Ce fichier est lu par les templates Nunjucks via la variable globale `home` :

```njk
{{ home.site.name }}           {# → "evo360" #}
{{ home.footer.description }}  {# → texte du footer #}
{% for member in home.team.members %} … {% endfor %}
```

Le JSON est la source de vérité. Le CMS Keystatic lit et écrit ce fichier.

### Routing

Eleventy génère automatiquement les URLs :

| Fichier source | URL générée |
|---|---|
| `src/index.njk` | `/` |
| `src/about.njk` | `/about/` |
| `src/services/coaching.mdoc` | `/services/coaching/` |
| `src/blog/mon-article.mdoc` | `/blog/mon-article/` |
| `src/mentions-legales.njk` | `/mentions-legales/` |

---

## CMS Keystatic

### Principe

Keystatic est un CMS headless qui s'appuie directement sur les fichiers du repo Git. Il ne nécessite aucune base de données. Les modifications effectuées via l'interface admin créent ou modifient des fichiers JSON/Markdoc qui sont ensuite commités sur GitHub.

```
Admin UI (navigateur)
    ↓  HTTPS
Cloudflare Worker (/api/keystatic/*)
    ↓  GitHub API
Repo GitHub (doctorfill-dev/evo360.ch)
    ↓  Build automatique
Cloudflare Pages → Production
```

### Deux modes de fonctionnement

| Mode | Contexte | Stockage | Authentification |
|---|---|---|---|
| **Local** | `npm run dev:admin` (dev) | Lecture/écriture directe sur disque | Aucune |
| **GitHub** | Production (evo360.ch/keystatic) | Via l'API GitHub (OAuth) | Compte GitHub autorisé |

Le mode est détecté automatiquement dans `keystatic.config.ts` : local si `NODE_ENV !== 'production'`, GitHub sinon.

### Variables d'environnement (production)

À configurer dans le dashboard Cloudflare Pages → Settings → Environment variables :

| Variable | Description |
|---|---|
| `KEYSTATIC_GITHUB_CLIENT_ID` | Client ID de l'OAuth App GitHub |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | Client Secret de l'OAuth App GitHub |
| `KEYSTATIC_SECRET` | Clé aléatoire pour signer les sessions (min. 32 caractères) |

### Accès à l'admin en production

URL : `https://evo360.ch/keystatic`

L'utilisateur est redirigé vers GitHub pour s'authentifier. Seuls les comptes ayant accès au repo `doctorfill-dev/evo360.ch` peuvent se connecter.

### Structure du schéma (`keystatic.config.ts`)

Le fichier définit deux types d'entités :

**Singletons** — fichiers JSON uniques :

| Singleton | Fichier | Description |
|---|---|---|
| `home` | `src/_data/home.json` | Tout le contenu de la homepage |
| `media` | `src/_data/media.json` | Médiathèque (upload d'images) |

**Collections** — dossiers de fichiers Markdoc :

| Collection | Dossier | Description |
|---|---|---|
| `services` | `src/services/*.mdoc` | Pages détaillées des services |
| `posts` | `src/blog/*.mdoc` | Articles de blog |

### Sections éditables de la homepage (`home`)

| Section | Clé JSON | Contenu |
|---|---|---|
| Blog (toggle) | `blog.enabled` | Active/désactive la section blog |
| Barre promo | `promo` | Bandeau promotionnel en haut de page |
| Coordonnées & SEO | `site` | Nom, URL, téléphone, email, adresse, image OG |
| Navigation | `nav` | Liens du menu + CTA header |
| Hero | `hero` | Titre, description, boutons, images, statistiques |
| Notre approche | `about` | Titre, accroche, texte, citation, image |
| Partenaire SportMed | `sportmed` | Titre, texte, logo, lien |
| Services (homepage) | `services.items` | Grille des services sur la page d'accueil |
| Tarifs | `pricing` | Plans d'abonnement avec prix et features |
| Témoignages | `testimonials` | Avis clients (cartes) |
| Équipe | `team` | Membres avec photo, rôle, bio |
| CTA | `cta` | Section d'appel à l'action |
| Instagram | `instagram` | Handle, URL, posts affichés |
| Contact | `contact` | Titre et description de la section |
| Footer | `footer` | Description + réseaux sociaux |

### Tarification des services

Les services (`src/services/*.mdoc`) supportent deux formats de prix dans leur frontmatter :

**Prix unique** (ex: Check-Up 360) :
```yaml
price: "CHF 50.-"
price_note: "Offert avec un abonnement fitness"
```

**Grille tarifaire** (ex: Coaching, Nutrition) :
```yaml
prices:
  - label: "Coaching (1 séance)"
    amount: "CHF 90.-"
  - label: "Coaching (5 séances)"
    amount: "CHF 425.-"
```

Ces deux formats sont mutuellement exclusifs — n'utilisez pas les deux simultanément sur le même service.

---

## Images

### Optimisation

Les images doivent être optimisées avant d'être ajoutées au repo :

```bash
# Place les images sources dans scripts/input/, puis :
npm run resize
# → génère des versions webp optimisées dans src/assets/img/
```

Le script `optimize-images.mjs` utilise Sharp pour :
- Convertir en `.webp`
- Générer des variantes `@400w` et `@800w` pour les srcsets responsives
- Appliquer une compression adaptée

### Favicon

Le favicon est un SVG (`src/assets/img/favicon.svg`). Les navigateurs modernes supportent les favicons SVG nativement. La déclaration dans `base.njk` :

```html
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/img/favicon.ico" type="image/x-icon">  <!-- fallback legacy -->
```

---

## Déploiement

Le déploiement est **automatique** via Cloudflare Pages :

1. Un push sur `main` déclenche un build Cloudflare
2. Cloudflare exécute `npm run build` (`eleventy && vite build`)
3. Le dossier `_site/` est déployé sur le CDN mondial

### Branches

| Branche | Environnement | URL |
|---|---|---|
| `main` | Production | `https://evo360.ch` |
| Autres branches | Preview | URL de preview Cloudflare |

---

## Conventions de code

- **Templates** : Nunjucks (`.njk`) pour les pages statiques, Markdoc (`.mdoc`) pour le contenu CMS
- **CSS** : Variables CSS, BEM-like, fichier unique `style.css` minifié au build
- **Polices** : Self-hosted (woff2), jamais de CDN Google Fonts sur les pages principales
- **Images** : Format `.webp`, attributs `width`/`height` et `loading="lazy"` obligatoires
- **Commits** : Messages en anglais, préfixes conventionnels (`feat:`, `fix:`, `perf:`, `docs:`)
