# Tutoriel CMS

## Informations initiales

Pour accéder au CMS : https://evo360.ch/keystatic/

Si les images de cette documentation sont trop petites, vous pouvez faire un `clic droit > ouvrir l'image dans un nouvel onglet` (sur macOS).

Ensuite se connecter avec le compte GitHub `lololapro`. Si un autre compte GitHub est utilisé, la personne peut accéder aux informations, mais ne peut pas éditer les informations. Si besoin d'ajouter un compte GitHub supplémentaire contacter `dev@doctorfill.ch` ou Laura.

> Les credentials du compte peuvent être demandés auprès de Laura.

---

## Le tutoriel

### Avant de commencer à modifier

#### Comprendre `main` et `dev`

Le CMS possède en haut à gauche une liste déroulante. Cette liste permet de choisir quel code on va modifier.

- L'élément `main` (appelé branche `main`) modifie le site : evo360.ch — soit le site de production
- L'élément `dev` (appelé branche `dev`) modifie le site de test : https://dev-evo360.jonathan-9fc.workers.dev/

L'idée est de d'abord tester les éléments sur le site de test afin de vérifier que la correction est bien appliquée, et qu'il n'y a pas d'erreurs ou de bugs visuels. Il est tout à fait possible de bypass le site de test et d'appliquer les modifications directement sur le site de production (evo360.ch).

Il existe encore une dernière possibilité, un peu plus « technique ». L'idée est de faire la modification sur l'élément `dev` de la liste déroulante, une fois que tout est bon, on a la possibilité — à droite de la liste déroulante (les trois petits points) — de faire une _pull request_. Cela va simplement fusionner les modifications de `dev` dans `main`. Ainsi, pas besoin de faire du travail à double. Le processus est cependant un peu plus complexe, mais permet de faire quelques tests automatiques pour vérifier qu'il n'y a pas de problème. Il y a également la possibilité d'ajouter un validateur manuel.

<div align="center">
  <img width="500" height="300" alt="image" src="https://github.com/user-attachments/assets/1a248090-2ed5-4985-bcaa-37518838150f" />
</div>

---

### Le concret

Maintenant que nous avons vu comment cela fonctionne, on va se pencher sur le concret : comment modifier du texte ou des images directement sur le site de production.

Le CMS est simple d'utilisation, il suffit de changer le texte dans les champs, puis de cliquer **Save** en haut à droite, et cela va modifier le texte. Le fonctionnement est similaire pour les images.

> ⚠️ Les changements mettent du temps à arriver (~1–2 min), soyez patients.

<div align="center">
  <img width="500" height="300" alt="image" src="https://github.com/user-attachments/assets/e65d5d41-d84a-4316-9cfb-e24a57819673" />
</div>
