## À quoi ça sert

Les `TODO` et `FIXME` s'accumulent et disparaissent de la mémoire de l'équipe. Ce script les recense, par type et par fichier, pour décider lesquels traiter avant une livraison. Il ne retient que les marqueurs situés **dans un commentaire** : une chaîne de caractères qui contient « TODO » n'est pas comptée.

## Avant de commencer

- Un dossier de code. `node_modules`, `.git`, les dossiers de build et les fichiers binaires sont ignorés.

## Pas à pas

1. Recensez :
   ```bash
   node src/todo-scan.mjs ./src
   ```
2. Repérez les fichiers les plus chargés (affichés en fin de rapport) : ce sont souvent les zones de dette technique.
3. Pour un tableau de bord ou un script, utilisez `--json`.

## Lire le résultat

Les marqueurs : `TODO` (à faire), `FIXME` (cassé ou faux), `HACK` (contournement), `XXX` (attention), `BUG` (défaut connu). Chaque ligne donne `fichier:ligne` et le texte.

## L'automatiser

Fixez un plafond : `--max 50` fait échouer la CI si le total le dépasse, ce qui empêche la dette de grossir sans que personne ne l'ait décidé.

## Pièges à éviter

- Un plafond trop bas, dès le premier jour, sera contourné : partez du total actuel et faites-le baisser.
- Un `TODO` sans description n'aide personne : écrivez ce qu'il faut faire et pourquoi.
