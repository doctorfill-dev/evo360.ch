# Documentation technique

> Cette page est destinée aux développeurs reprenant le projet.

---

## Architecture

```
GitHub (code source)
  └── Push sur `main`
        └── GitHub Actions (.github/workflows/deploy.yml)
              ├── npm install
              ├── npm run build  →  Eleventy (HTML/CSS/JS) + Vite (admin Keystatic)
              └── wrangler deploy  →  Cloudflare Workers
                                          ├── Worker TypeScript (worker.ts)
                                          │     ├── /api/keystatic/*  →  API Keystatic (lecture/écriture GitHub)
                                          │     ├── /keystatic/*      →  SPA admin (index.html)
                                          │     └── Tout le reste     →  Assets statiques (_site/)
                                          └── Assets servis par le CDN Cloudflare
```

---

## Branches

| Branche | Environnement | URL | Déploiement |
|---|---|---|---|
| `main` | Production | https://evo360.ch | Automatique (push) |
| `dev` | Staging | https://dev-evo360.jonathan-9fc.workers.dev/ | Automatique (push) |
| `design/*` | Expérimental | — | Manuel uniquement |

---

## Stack technique

| Outil | Rôle | Version |
|---|---|---|
| [Eleventy (11ty)](https://www.11ty.dev/) | Générateur de site statique | 3.x |
| [Nunjucks](https://mozilla.github.io/nunjucks/) | Langage de templates HTML | — |
| [Keystatic](https://keystatic.com/) | CMS Git-based | 0.5.x |
| [Vite](https://vitejs.dev/) | Bundler pour l'interface admin Keystatic | 6.x |
| [Cloudflare Workers](https://workers.cloudflare.com/) | Hébergement + logique serveur | — |
| [Wrangler](https://developers.cloudflare.com/workers/wrangler/) | CLI de déploiement Cloudflare | 3.x |

---

## Structure du dépôt

```
evo360.ch/
├── src/                        # Sources Eleventy
│   ├── _data/                  # Données JSON (contenu CMS : home.json, media.json)
│   ├── _includes/
│   │   ├── layouts/            # Templates de page (base.njk, legal.njk, service.njk)
│   │   └── partials/           # Sections de la page d'accueil (hero, services, etc.)
│   ├── assets/
│   │   ├── css/style.css       # Feuille de style principale
│   │   ├── js/main.js          # JavaScript côté client
│   │   └── images/             # Images source
│   ├── services/               # Pages individuelles de services (.njk)
│   └── *.njk                   # Pages racine (index, 404, mentions-legales, etc.)
├── _site/                      # Build Eleventy (généré automatiquement, ne pas modifier)
├── worker.ts                   # Cloudflare Worker (routing)
├── wrangler.toml               # Configuration Cloudflare Workers
├── keystatic.config.ts         # Configuration du CMS Keystatic
├── vite.config.ts              # Configuration Vite (build admin)
├── wiki/                       # Cette documentation
└── .github/workflows/
    └── deploy.yml              # Pipeline CI/CD
```

---

## DNS (Cloudflare)

Les DNS du domaine `evo360.ch` sont gérés directement par Cloudflare (nameservers Cloudflare).

Accès : [dash.cloudflare.com](https://dash.cloudflare.com) > evo360.ch > **DNS**

> ⚠️ Ne pas supprimer d'enregistrements sans savoir ce qu'ils font. En particulier :
> - Les enregistrements **MX** (messagerie — suppression = perte des emails)
> - Les enregistrements **TXT** de type SPF/DKIM (authentification email)
> - Les enregistrements **TXT** de vérification Google Search Console

---

## Secrets GitHub Actions

Deux secrets sont requis dans le dépôt GitHub pour que le déploiement automatique fonctionne.

→ GitHub > Settings > **Secrets and variables** > Actions

| Secret | Description |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Token API Cloudflare avec permission *Workers Scripts: Edit* |
| `CLOUDFLARE_ACCOUNT_ID` | ID du compte Cloudflare (visible dans le Dashboard) |

Si ces secrets sont manquants ou expirés, le déploiement échouera. Pour renouveler un token : Cloudflare Dashboard > **My Profile** > API Tokens.

---

## Développement local

```bash
# 1. Cloner le dépôt
git clone https://github.com/doctorfill-dev/evo360.ch.git
cd evo360.ch

# 2. Installer les dépendances (Node.js 20+ requis)
npm install

# 3. Lancer le serveur de développement
npm run dev          # Site principal → http://localhost:8080

# 4. Build de production
npm run build        # Génère _site/ + bundle Vite admin
```

> En local, Keystatic fonctionne en mode `local` (lecture/écriture directe sur le disque, pas besoin de GitHub).
> Sur les environnements déployés (dev, main), il utilise l'API GitHub.

## Commandes utiles

```bash
npm run resize       # Optimise et redimensionne les images sources (via Sharp)
npx wrangler dev     # Tester le Worker Cloudflare en local (port 8787)
npx wrangler deploy  # Déploiement manuel (nécessite npx wrangler login au préalable)
```
