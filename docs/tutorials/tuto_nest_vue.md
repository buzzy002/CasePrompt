# Théorie
Nous avons d'une part le **backend** en Nest, qui est le serveur (ce qu'on ne voit pas). Il permet de gérer l'accès à la base de données, de gérer les routes (voir point suivant) et enfin d'avoir de la logique (par exemple calculer des trucs).

Nous avons d'autre part le **frontend** en Vue, qui est ce que l'utilisateur voit et utilise dans son navigateur.

Les deux communiquent entre eux avec des routes, sous forme de requêtes HTTP :
- **GET** veut dire que le front demande des données au backend, par exemple les infos d'un utilisateur.
- **POST** veut dire que le front envoie des données au serveur pour qu'il les traite.

(Il en existe d'autres, par exemple PUT ou PATCH pour modifier et DELETE pour supprimer.)

Dans tous les cas, chaque requête reçoit une réponse. Mais le backend ne peut jamais envoyer de données au frontend de lui-même : il répond seulement quand on lui demande. C'est pour ça que, pour le projet d'avant, on a utilisé les **WebSockets** : ils gardent une connexion ouverte entre le navigateur et le serveur, ce qui permet au serveur d'envoyer des messages quand il veut. C'est comme ça que deux utilisateurs peuvent voir en direct ce que fait l'autre : le serveur relaie les messages entre eux.

## À quoi ressemble une requête et sa réponse

Pour avoir un exemple clair, on peut regarde sur un site quand on fait un f12 et qu'on va dans réseau 

Une requête contient :
- une **méthode** (GET, POST…) et un **chemin** (`/users/12`) ;
- des **en-têtes** (headers) : des infos sur la requête, par exemple le format des données envoyées ;
- un **corps** (body) : les données envoyées. Un GET n'en a généralement pas, un POST oui.

La réponse contient :
- un **code de statut**, qui dit si tout s'est bien passé ;
- des en-têtes ;
- un corps : les données renvoyées, le plus souvent en JSON.

**Exemple avec GET** : le front demande les infos de l'utilisateur n°12.
```
GET /users/12
```
Réponse :
```
200 OK
Content-Type: application/json

{ "id": 12, "nom": "Léa", "age": 20 }
```

**Exemple avec POST** : le front envoie un nouvel utilisateur à créer.
```
POST /users
Content-Type: application/json

{ "nom": "Tom", "age": 22 }
```
Réponse :
```
201 Created
Content-Type: application/json

{ "id": 13, "nom": "Tom", "age": 22 }
```

Les codes de statut les plus courants :

| Code | Signification |
| --- | --- |
| 200 OK | Tout s'est bien passé |
| 201 Created | Quelque chose a été créé (c'est le code par défaut d'un POST dans Nest) |
| 400 Bad Request | Les données envoyées ne sont pas correctes |
| 401 Unauthorized | Il faut être connecté |
| 404 Not Found | La route ou la ressource n'existe pas |
| 500 Internal Server Error | Le serveur a planté |

# Pratique
## Installation
**Il faut avoir Node et npm.**\
Pour avoir les dernières versions, on installe d'abord nvm (le gestionnaire de versions de Node).\
Sous Linux, voici les commandes :
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | bash
source ~/.bashrc
nvm install --lts
```

### Backend Nest (dossier api)
```bash
npx @nestjs/cli new api
cd api
npm install
```

### Frontend Vue (dossier web)
À lancer depuis le dossier racine du projet, à côté de `api` (pas dedans) :
```bash
npm create vue@latest web
cd web
npm install
npm run dev
```
Pendant la création, on répond **oui à TypeScript** et non au reste (Router, Pinia, tests…) pour avoir le projet le plus simple possible.

### Problème CORS
En local, le front tourne sur `localhost:5173` et le back sur `localhost:3000`. Pour le navigateur, ce sont deux **origines** différentes (le port compte). Par sécurité, il bloque les appels d'une origine vers une autre, sauf si le serveur dit explicitement qu'il les accepte.

Il faut donc ajouter cette ligne dans `api/src/main.ts`, avant le `listen` :
```ts
app.enableCors({ origin: 'http://localhost:5173' }); // autorise uniquement le front Vue
```
On n'autorise que l'adresse du front, pas tous les sites.

Remarque : `curl` n'est pas bloqué par CORS, parce que ce n'est pas un navigateur. Le problème n'apparaît que quand Vue appelle l'API.

## Fonctionnement du backend Nest
### Fichiers de base
Dans `src`, on a 4 fichiers :
- **controller** (`app.controller.ts`) : reçoit les requêtes HTTP, décide quoi en faire et renvoie la réponse (voir la théorie).
- **service** (`app.service.ts`) : contient la « logique métier », donc le vrai travail, par exemple un calcul.
- **module** (`app.module.ts`) : lie les controllers et les services entre eux. C'est grâce à lui que le controller peut utiliser le service.
- **main** (`main.ts`) : le point d'entrée. Il crée l'application à partir du module et la démarre.

Exemple, le chemin d'une requête : le navigateur demande `/`, le controller la reçoit, il demande au service de faire le travail, le service renvoie « Hello World! », et le controller le renvoie au navigateur.

À retenir : **le controller ne fait pas le travail, il le délègue au service.**

### Création d'une route
Pour tester tout ça, je vais faire une petite route qui permet d'envoyer 2 nombres et qui renvoie leur somme.

On commence par créer les fichiers :
```bash
npx nest g module calcul
npx nest g controller calcul --no-spec
npx nest g service calcul --no-spec
```
`--no-spec` évite de créer les fichiers de tests, dont on n'a pas besoin ici.

#### Service
```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class CalculService {
    sumNumbers(n1: number, n2: number): number {
        return n1 + n2;
    }
}
```
On a donc une fonction basique qui additionne 2 nombres. Le décorateur `@Injectable()` signifie que cette classe peut être injectée ailleurs, par exemple dans le controller.

#### Controller
```ts
import { Body, Controller, Post } from '@nestjs/common';
import { CalculService } from './calcul.service.js';

@Controller('calcul') // toutes les routes de ce controller commencent par /calcul
export class CalculController {
    // on demande à Nest de nous donner le service (c'est l'injection de dépendances)
    constructor(private readonly calculService: CalculService) { }

    // on utilise POST parce que le frontend envoie des données et attend une réponse.
    // si on voulait juste récupérer quelque chose sans rien envoyer, ce serait GET
    @Post()
    postSum(@Body() numbers: { first: number, second: number }) {
        // @Body() met le JSON envoyé par le client dans le paramètre numbers.
        // on utilise la fonction qu'on a créée dans le service et on forme la réponse
        return { resultat: this.calculService.sumNumbers(numbers.first, numbers.second) };
    }
}
```

La route est formée avec ce qu'il y a dans les décorateurs : `@Controller('calcul')` donne le préfixe, `@Post()` ajoute le reste du chemin (ici rien).\
La route sera donc `POST /calcul`.\
Si on avait `@Post('somme')`, on aurait `POST /calcul/somme`.

#### Module
```ts
import { Module } from '@nestjs/common';
import { CalculController } from './calcul.controller.js';
import { CalculService } from './calcul.service.js';

@Module({
  controllers: [CalculController],
  providers: [CalculService]
})
export class CalculModule {}
```
Ce fichier est généré automatiquement, on n'a rien à y changer. Le CLI a aussi ajouté `CalculModule` dans les `imports` de `app.module.ts`, pour que l'application le connaisse.

#### Test
Sous Linux (ou macOS), avec `curl` :
```bash
curl -X POST http://localhost:3000/calcul -H "Content-Type: application/json" -d '{"first":2,"second":3}'
```
Réponse attendue : `{"resultat":5}`

Sous Windows, le plus simple est d'utiliser un outil comme Postman, ou l'extension Thunder Client de VS Code : on choisit POST, l'adresse `http://localhost:3000/calcul`, et on met `{"first":2,"second":3}` dans le corps en JSON.

### Valider les données reçues
#### Le problème
Si on envoie les nombres entre guillemets, `{"first":"2","second":"3"}`, la route renvoie `{"resultat":"23"}` : `"2" + "3"` colle deux textes au lieu d'additionner deux nombres.

Pourquoi ? **Les types TypeScript disparaissent quand le code tourne.** Écrire `first: number` aide l'éditeur à nous prévenir pendant qu'on code, mais ne vérifie rien de ce que le client envoie vraiment.

La solution de Nest est d'utiliser une **classe** à la place du type : une classe existe toujours quand le code tourne, et on peut lui mettre des décorateurs qui décrivent les règles. Cette classe s'appelle un **DTO** (*Data Transfer Object*) : elle décrit la forme des données qui arrivent.

#### 1. Installer les bibliothèques
```bash
npm install class-validator class-transformer
```

#### 2. Créer le DTO
Dans un nouveau fichier `src/calcul/dto/sum.dto.ts` :
```ts
import { IsNumber } from 'class-validator';

export class SumDto {
    @IsNumber() // règle : cette propriété doit être un nombre
    first!: number;

    @IsNumber()
    second!: number;
}
```
Le `!` après le nom dit à TypeScript : « cette propriété n'a pas de valeur au départ, c'est Nest qui la remplira avec les données reçues ». Sans lui, TypeScript se plaint qu'elle n'a « pas d'initialiseur ».

#### 3. L'utiliser dans le controller
On remplace le type `{ first: number, second: number }` par la classe `SumDto` :
```ts
import { Body, Controller, Post } from '@nestjs/common';
import { CalculService } from './calcul.service.js';
import { SumDto } from './dto/sum.dto.js';

@Controller('calcul')
export class CalculController {
    constructor(private readonly calculService: CalculService) { }

    @Post()
    postSum(@Body() numbers: SumDto): { resultat: number } {
        return { resultat: this.calculService.sumNumbers(numbers.first, numbers.second) };
    }
}
```

#### 4. Activer la validation dans `main.ts`
```ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:5173' }); // voir « Problème CORS »
  app.useGlobalPipes(new ValidationPipe()); // vérifie les DTO de toutes les routes
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

Ce qui se passe maintenant : avant d'appeler notre méthode, le `ValidationPipe` regarde le type du paramètre, voit que c'est `SumDto`, et vérifie chaque règle. Si une règle échoue, il renvoie directement une erreur 400, et notre méthode n'est même pas appelée.

#### Test
Avec `{"first":2,"second":3}`, on obtient toujours `{"resultat":5}`.

Avec `{"first":"2","second":"3"}`, on reçoit maintenant une erreur :
```json
{
  "message": [
    "first must be a number conforming to the specified constraints",
    "second must be a number conforming to the specified constraints"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

## Fonctionnement du frontend Vue
### Page de base
Elle se trouve dans `web/src/App.vue`. On remplace tout son contenu par notre page (on peut ignorer ou supprimer les composants d'exemple dans `src/components`).

Un fichier `.vue` a deux parties :
- `<script setup lang="ts">` : le code (les variables, les fonctions) ;
- `<template>` : le HTML de la page.

### Les variables réactives
Une variable **réactive** se crée avec `ref`. Quand sa valeur change, la page se met à jour toute seule.
```ts
import { ref } from 'vue';

const compteur = ref(0);
compteur.value++; // dans le script, on passe par .value
```
Dans le `<template>`, on écrit `{{ compteur }}` **sans** `.value` : Vue l'ajoute tout seul. C'est l'erreur la plus fréquente au début.

### Ce qu'on utilise dans le template
| Syntaxe | Rôle | Exemple |
| --- | --- | --- |
| `{{ ... }}` | Afficher une valeur | `<p>{{ nom }}</p>` |
| `v-model` | Relier un champ à une variable, dans les deux sens | `<input v-model="nom">` |
| `v-model.number` | Pareil, mais convertit en nombre | `<input type="number" v-model.number="age">` |
| `@click` | Réagir à un clic | `<button @click="valider">OK</button>` |
| `v-if` | Afficher seulement si une condition est vraie | `<p v-if="erreur">{{ erreur }}</p>` |

### Appeler notre route
Voici la page qui envoie deux nombres à `POST /calcul` et affiche le résultat :
```vue
<script setup lang="ts">
import { ref } from 'vue';

// les deux nombres tapés par l'utilisateur
const number1 = ref(0);
const number2 = ref(0);
// le résultat : rien (null) tant qu'on n'a pas calculé
const result = ref<number | null>(null);

async function calculer() {
  // on envoie la requête au back (adresse complète, sinon ça part vers le port de Vue)
  const res = await fetch('http://localhost:3000/calcul', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // on prévient qu'on envoie du JSON
    body: JSON.stringify({ first: number1.value, second: number2.value }), // l'objet transformé en texte JSON
  });
  // on lit la réponse : { resultat: 5 }
  const data = await res.json();
  // on garde juste le nombre
  result.value = data.resultat;
}
</script>

<template>
  <!-- .number convertit en nombre, sinon le back reçoit du texte et renvoie une erreur 400 -->
  <input type="number" v-model.number="number1">
  <input type="number" v-model.number="number2">
  <button @click="calculer">Calculer</button>
  <p v-if="result !== null">Résultat : {{ result }}</p>
</template>
```

## Commandes utiles
### Lancer le backend
Dans le dossier `api` :\
`npm run start:dev`\
Le serveur se relance tout seul à chaque modification d'un fichier.\
Le port par défaut est : `http://localhost:3000/`
### Lancer le front
Dans le dossier `web` :\
`npm run dev`\
Il se met aussi à jour tout seul à chaque modification.\
Le port par défaut est : `http://localhost:5173/`

Il faut que les deux tournent en même temps, chacun dans son terminal.