# FAQ — Problèmes fréquents

---

## Le site ne se met pas à jour après une modification dans le CMS

1. Attendre **1–2 minutes** — le build et le déploiement prennent du temps.
2. Vider le cache du navigateur (`Cmd+Shift+R` sur Mac, `Ctrl+Shift+R` sur Windows).
3. Vérifier que la modification a bien été sauvegardée (bouton **Save** dans le CMS).
4. Si le problème persiste : vérifier le statut du déploiement sur [GitHub Actions](https://github.com/doctorfill-dev/evo360.ch/actions).

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

## Une image ne s'affiche pas sur le site

- Vérifier que l'image a bien été uploadée via le CMS et que le champ est sauvegardé.
- Vérifier que le nom de fichier ne contient pas de caractères spéciaux, accents ou espaces.
- Si l'image est très lourde (> 2 Mo), demander au développeur de lancer `npm run resize`.
