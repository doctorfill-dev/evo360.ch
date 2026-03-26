# Guide du contenu

Cette page explique comment modifier les différentes sections du site via le CMS.

---

## Collections disponibles

| Collection | Description |
|---|---|
| **Page d'accueil** | Textes et images des sections hero, à propos, CTA |
| **Services** | Liste des services (titre, description, image, page dédiée) |
| **Équipe** | Membres de l'équipe (photo, nom, titre, bio) |
| **Témoignages** | Avis clients (texte, auteur) |
| **Tarifs** | Offres et prix |
| **Médias** | Images réutilisables (logo, bannières) |

---

## Modifier un élément existant

1. Ouvrir le CMS → choisir la collection
2. Cliquer sur l'élément à modifier
3. Modifier les champs souhaités
4. Cliquer **Save** en haut à droite

---

## Ajouter un nouveau service

1. CMS → **Services** → **New entry**
2. Remplir : titre, description courte, description longue, image, slug URL
3. Cocher **Visible sur la page d'accueil** si nécessaire
4. **Save**

> Le slug définit l'URL finale : `evo360.ch/services/mon-slug`
> Choisir un slug court, en minuscules, sans accents ni espaces (utiliser des tirets).

---

## Recommandations pour les images

| Usage | Dimensions conseillées | Format |
|---|---|---|
| Carte service (accueil) | 800 × 600 px | JPG / WebP |
| Header page service | 1200 × 800 px | JPG / WebP |
| Photo équipe | 600 × 600 px (carré) | JPG / WebP |
| Logo / icône | — | SVG |

Après avoir uploadé une image, demander au développeur de lancer `npm run resize` pour optimiser les fichiers (compression + génération des formats WebP).
