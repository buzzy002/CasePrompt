# Comment on travaille avec Git

## Les branches

| Branche | À quoi elle sert |
| --- | --- |
| `main` | La production. Chaque merge sur `main` déploie le site. On n'y met que du travail fini et testé. |
| `develop` | La version de test, où l'on rassemble le travail de tout le monde. |
| `feature/...` | Une nouvelle fonctionnalité : `feature/connexion`, `feature/ecran-de-jeu` |
| `fix/...` | Une correction de bug : `fix/chat-vide` |
| `docs/...` | De la documentation : `docs/project-analysis` |

**Règle d'or : on ne travaille jamais directement sur `main` ni sur `develop`.** On crée toujours sa propre branche à partir de `develop`.

## Exemple : ajouter la connexion

**1. Partir d'un `develop` à jour**

```bash
git checkout develop      # aller sur la branche develop
git pull                  # récupérer tout ce que les autres y ont ajouté
```

**2. Créer sa branche**

```bash
git checkout -b feature/connexion
```

**3. Travailler et enregistrer son travail**\
/!\ répetable, c'et bien de faire beaucoup de commits

```bash
git status                                 # voir ce qui a changé
git add xxx                                # on ajoute ce qu'on veut commenter et ajouter
git commit -m "feat: add login form"       # enregistrer avec un message clair, il faut essayer de suivre la structure feat/chose/docs/fix: verbe ce qu'on a fait voir en bas pour plus de détails
```

On peut faire plusieurs commits sur la même branche, un par petite étape.

**4. Envoyer sa branche sur GitHub**

```bash
git push -u origin feature/connexion       # la première fois
git push                                   # les fois suivantes
```

**5. Ouvrir une Pull Request**

Sur GitHub : **Pull requests**, puis **New pull request**, base `develop`, compare `feature/connexion`. Décrire ce qu'on a fait et comment le tester. Un collègue relit, puis on merge.git


## Les messages de commit

Un préfixe, puis une phrase courte en anglais qui dit ce que fait le commit :

| Préfixe | Quand | Exemple |
| --- | --- | --- |
| `feat:` | Nouvelle fonctionnalité | `feat: add evidence file` |
| `fix:` | Correction de bug | `fix: keep player text after an error` |
| `docs:` | Documentation | `docs: add git tutorial` |
| `chore:` | Configuration, pipeline, dépendances | `chore: add lint to CI` |

## Commandes utiles

```bash
git status              # où j'en suis, quels fichiers ont changé
git branch              # sur quelle branche je suis
git log --oneline       # l'historique des commits
```
