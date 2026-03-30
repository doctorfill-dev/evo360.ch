# FAQ — Problèmes fréquents

---

## Le site ne se met pas à jour après une modification dans le CMS

1. Attendre **1–2 minutes** — le build et le déploiement prennent du temps.
2. Vider le cache du navigateur (`Cmd+Shift+R` sur Mac, `Ctrl+Shift+R` sur Windows).
3. Vérifier que la modification a bien été sauvegardée (bouton **Save** dans le CMS).
4. Si le problème persiste : vérifier le statut du déploiement sur [GitHub Actions](https://github.com/doctorfill-dev/evo360.ch/actions).

---

## Les images ont disparu après une modification dans le CMS ⚠️

C'est le problème le plus courant. Il survient lorsque Keystatic **renomme les images existantes** au moment d'une sauvegarde — même si vous n'avez modifié que du texte.

**Ce qui se passe concrètement :**
Keystatic génère un nom générique `image.webp` pour chaque champ image lors de l'enregistrement. Si les fichiers originaux portaient un autre nom (ex. `fitness_1.webp`), ils sont remplacés par des fichiers vides et le JSON est mis à jour avec le nouveau chemin. Les variantes responsive (`@400w`, `@800w`) ne sont jamais générées automatiquement.

**Symptômes :**
- Des images s'affichent en cassé (icône brisée) sur le site
- Des erreurs 404 apparaissent dans la console sur les chemins `image@400w.webp`

**Solution :**

1. Contacter `dev@doctorfill.ch` ou Jonathan.
2. Le développeur doit :
   - Restaurer les fichiers supprimés via git : `git checkout <commit-avant>~1 -- src/assets/img`
   - Générer les variantes responsive manquantes : `npm run resize`
   - Commiter et déployer

**Comment éviter le problème :**
- Ne jamais modifier du texte ET des images dans la même session CMS si vous n'êtes pas sûr·e.
- Après toute sauvegarde CMS, vérifier rapidement que le site s'affiche correctement avant de continuer.
- Idéalement, tester d'abord sur la branche `dev` avant d'appliquer sur `main`.

---

## Une page affiche une erreur 404

- Vérifier l'URL : elle doit correspondre exactement au slug défini dans le CMS.
- Si la page a été récemment créée, attendre le déploiement (~2 min).
- Si une ancienne URL renvoie une 404 après un renommage, c'est normal — Google désindexera l'ancienne URL progressivement.

---

## Le déploiement échoue dans GitHub Actions

1. Aller sur [GitHub Actions](https://github.com/doctorfill-dev/evo360.ch/actions) et ouvrir le job en erreur.
2. Lire le message d'erreur dans les logs.
3. Causes fréquentes :
   - Secret Cloudflare expiré (`CLOUDFLARE_API_TOKEN`) → renouveler dans Cloudflare Dashboard > My Profile > API Tokens
   - Erreur de build Eleventy (template mal formé) → vérifier le fichier modifié
   - Conflit de merge non résolu → contacter `dev@doctorfill.ch`

---

## Je ne peux pas me connecter au CMS

- Vérifier que le compte GitHub utilisé est `lololapro` ou un compte autorisé.
- Si un autre compte est utilisé, contacter `dev@doctorfill.ch` pour ajouter les accès.

---

## Comment savoir si Google indexe bien le site ?

→ [Google Search Console](https://search.google.com/search-console) > **Couverture** : pages indexées vs. erreurs.

Vérifier également que le sitemap est bien soumis : `https://evo360.ch/sitemap.xml`

---

## Une image uploadée ne s'affiche pas sur le site

- Vérifier que l'image a bien été uploadée via le CMS et que le champ est sauvegardé.
- Vérifier que le nom de fichier ne contient pas de caractères spéciaux, accents ou espaces.
- Si l'image est très lourde (> 2 Mo), le build peut échouer — contacter `dev@doctorfill.ch`.
- Après upload d'une nouvelle image, le développeur doit lancer `npm run resize` pour générer les variantes responsive. Sans ça, les images s'affichent en basse résolution ou pas du tout sur certains appareils.

---

## La barre promotionnelle ne s'affiche pas

- Vérifier dans le CMS (Page d'accueil > Barre promotionnelle) que **Afficher la barre promotionnelle** est bien coché.
- Vérifier que le champ **Texte** n'est pas vide.
- Si l'utilisateur a déjà fermé la bannière, elle reste masquée jusqu'à ce qu'il vide son cache (ou ouvre le site dans un autre navigateur).
