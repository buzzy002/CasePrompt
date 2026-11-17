# Théorie
Nous avons d'une part le **backend** en Nest, qui est le serveur (ce qu'on ne voit pas). Il permet de gérer l'accès à la base de données, de gérer les routes (voir point suivant) et enfin d'avoir de la logique (par exemple calculer des trucs).

Nous avons d'autre part le **frontend** en Vue, qui est ce que l'utilisateur voit et utilise dans son navigateur.

Les deux communiquent entre eux avec des routes, sous forme de requêtes HTTP :
- **GET** veut dire que le front demande des données au backend, par exemple les infos d'un utilisateur.
- **POST** veut dire que le front envoie des données au serveur pour qu'il les traite.

(Il en existe d'autres, par exemple PUT ou PATCH pour modifier et DELETE pour supprimer.)

Dans tous les cas, chaque requête reçoit une réponse. Mais le backend ne peut jamais envoyer de données au frontend de lui-même : il répond seulement quand on lui demande. C'est pour ça que, pour le projet d'avant, on a utilisé les **WebSockets** : ils gardent une connexion ouverte entre le navigateur et le serveur, ce qui permet au serveur d'envoyer des messages quand il veut. C'est comme ça que deux utilisateurs peuvent voir en direct ce que fait l'autre : le serveur relaie les messages entre eux.

## À quoi ressemble une requête et sa réponse

Pour voir de vrais exemples, on peut ouvrir n'importe quel site, appuyer sur `F12` et aller dans l'onglet **Réseau** (Network) : chaque ligne est une requête, et en cliquant dessus on voit ses en-têtes, ce qui a été envoyé et la réponse.

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

## Base de données PostgreSQL
### Docker
Pour la base de données, on utilise **Docker**, qui lance des programmes dans des **conteneurs** : des petites boîtes isolées qui contiennent déjà tout ce qu'il faut.
- une **image** est le modèle, par exemple `postgres:18` : une base PostgreSQL déjà installée, téléchargée depuis internet ;
- un **conteneur** est une copie de cette image qui tourne sur notre machine.

Avantages : on n'installe pas PostgreSQL sur son PC, tout le monde a la même version, et sur le serveur on lancera tout de la même façon.

#### Installation
Sous Linux :
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```
Sous Windows ou macOS, on installe Docker Desktop depuis le site de Docker.

Pour ne pas devoir mettre `sudo` devant chaque commande Docker (Linux), on s'ajoute au groupe `docker`, puis on se déconnecte et se reconnecte :
```bash
sudo usermod -aG docker $USER
```

Pour vérifier que Docker marche :
```bash
docker run hello-world
```
Il doit afficher « Hello from Docker! ».

#### Créer la base
```bash
docker run --name test-postgres -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=calcul -p 5432:5432 -d postgres:18
```
- `--name test-postgres` : le nom du conteneur, pour le retrouver ;
- `-e ...` : l'utilisateur, le mot de passe et le nom de la base à créer ;
- `-p 5432:5432` : rend le port de la base accessible depuis notre machine ;
- `-d` : lance en arrière-plan ;
- `postgres:18` : l'image officielle de PostgreSQL, version 18.

On vérifie qu'elle tourne avec `docker ps`, puis on peut entrer dans la base :
```bash
docker exec -it test-postgres psql -U admin -d calcul
```
Dans `psql` : `\dt` liste les tables, `\d "NomDeLaTable"` montre ses colonnes, `\q` pour sortir.

### ORM Prisma
Un **ORM** transforme les tables en objets utilisables dans le code, pour éviter d'écrire les requêtes SQL à la main. C'est l'équivalent d'Eloquent dans Laravel.

⚠️ **On utilise Prisma 7.** npm installe par défaut Prisma 8, qui n'est qu'une version de test (release candidate), avec d'autres commandes et des fonctionnalités en moins. Tous les tutos, dont celui de NestJS, utilisent encore Prisma 7. On précise donc la version avec `@7`.

#### Installation
On installe tout **dans `api`** :
```bash
npm install --save-dev prisma@7
npm install @prisma/client@7 @prisma/adapter-pg@7 pg dotenv
```
- `prisma` : l'outil en ligne de commande (créer les tables, générer le code), utile seulement pendant le développement, d'où `--save-dev` ;
- `@prisma/client` : la bibliothèque que notre code utilise pour lire et écrire ;
- `@prisma/adapter-pg` et `pg` : le « pilote » qui permet à Prisma de parler à PostgreSQL ;
- `dotenv` : lit le fichier `.env`.

On vérifie avec `npx prisma --version` : la version doit commencer par `7.`.

#### Initialisation
```bash
npx prisma init --output ../src/generated/prisma
```
Ça crée :
- `prisma/schema.prisma` : où on décrit les tables ;
- `prisma.config.ts` : la configuration de Prisma. Sa première ligne `import "dotenv/config"` lit le `.env`, d'où l'installation de `dotenv` ;
- `.env` : les variables secrètes. S'il n'apparaît pas, c'est peut-être juste qu'il est caché (`ls -a` pour le voir) ; sinon, on le crée soi-même à la racine de `api`.

Le `--output` indique où Prisma range le code TypeScript qu'il génère.

#### L'adresse de la base
Dans `.env` :
```
DATABASE_URL="postgresql://admin:admin@localhost:5432/calcul?schema=public"
```
Elle se lit : `postgresql://utilisateur:motdepasse@machine:port/nomdelabase`. Ce sont exactement les valeurs du `docker run`.

⚠️ Le `.env` contient un mot de passe : il ne doit **jamais** aller sur GitHub. On vérifie que `.env` est bien dans le `.gitignore`.

#### Décrire la table
À la fin de `prisma/schema.prisma`, on décrit un **modèle** : chaque modèle devient une table, chaque ligne une colonne (nom, type, puis des attributs qui commencent par `@`).
```prisma
model Calcul {
  id        Int      @id @default(autoincrement()) // clé primaire, numérotée automatiquement
  first     Float                                  // Float : nombre à virgule
  second    Float
  result    Float
  createdAt DateTime @default(now())               // la date du moment, mise par la base
}
```

#### Créer la table
Le conteneur Docker doit tourner :
```bash
npx prisma migrate dev --name init
npx prisma generate
```
- `migrate dev` écrit le SQL qui crée la table dans `prisma/migrations`, puis l'exécute sur la base ;
- `generate` crée le code TypeScript dans `src/generated/prisma`, qui permet d'utiliser la table dans le code. À relancer après chaque modification du schéma.

On vérifie dans `psql` avec `\dt` : la table `Calcul` doit apparaître.

#### Modifier une table plus tard
Si on ajoute ou change une colonne dans `schema.prisma` (par exemple `createdAt` oubliée au début), on relance les deux commandes, avec un nom qui décrit le changement :
```bash
npx prisma migrate dev --name add_created_at
npx prisma generate
```
Si on oublie `generate`, le code TypeScript ne connaît pas la nouvelle colonne et on a des erreurs du genre « createdAt does not exist in type… ». Si l'erreur reste affichée dans VS Code : `Ctrl+Shift+P`, puis « TypeScript: Restart TS Server ».

### Brancher Prisma dans Nest
On crée un **service Prisma**, que les autres services pourront recevoir dans leur constructeur, comme le controller reçoit `CalculService`.
```bash
npx nest g module prisma
npx nest g service prisma --no-spec
```

#### Le service
`src/prisma/prisma.service.ts` :
```ts
import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    // le pilote PostgreSQL, avec l'adresse de la base lue dans .env
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL as string });
    super({ adapter });
  }
}
```
`extends PrismaClient` veut dire que ce service **est** le client Prisma : il a directement des fonctions comme `this.prisma.calcul.create(...)`, générées à partir de notre modèle.

#### Les modules
Par défaut, un service n'est visible que dans son propre module. Il faut donc :

1. que le module Prisma **partage** son service, `src/prisma/prisma.module.ts` :
```ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Module({
  providers: [PrismaService],
  exports: [PrismaService] // on partage le service avec les modules qui importent celui-ci
})
export class PrismaModule { }
```

2. que le module `calcul` **importe** le module Prisma, `src/calcul/calcul.module.ts` :
```ts
import { Module } from '@nestjs/common';
import { CalculController } from './calcul.controller.js';
import { CalculService } from './calcul.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  controllers: [CalculController],
  providers: [CalculService],
  imports: [PrismaModule] // on a besoin du module Prisma
})
export class CalculModule { }
```

À retenir :
- **`imports`** : les modules dont j'ai besoin ;
- **`providers`** : les services que je fabrique ;
- **`exports`** : ceux de mes services que je partage avec les autres.

⚠️ Il ne faut pas que deux modules s'importent l'un l'autre (« dépendance circulaire ») : ici c'est `calcul` qui a besoin de Prisma, pas l'inverse.

#### Charger le `.env` au démarrage du serveur
`prisma.config.ts` lit le `.env` pour les commandes Prisma, mais pas pour le serveur. On ajoute donc une ligne **tout en haut** de `main.ts`. Le `main.ts` complet devient :
```ts
import 'dotenv/config'; // lit le .env (DATABASE_URL), à mettre en tout premier
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:5173' });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

### Enregistrer et lire les calculs
Objectif : chaque `POST /calcul` enregistre le calcul, et une nouvelle route `GET /calcul/historique` renvoie les 10 derniers.

#### `async` / `await` côté serveur
Parler à la base prend du temps, donc les fonctions de Prisma renvoient une **promesse**, comme `fetch` dans Vue. Toute méthode qui utilise Prisma devient `async`, on met `await` devant les appels, et son type de retour devient `Promise<...>`.

#### Comment on utilise Prisma
```ts
// créer une ligne : les colonnes à remplir vont dans "data"
await this.prisma.calcul.create({
  data: { first: 2, second: 3, result: 5 },
});

// lire plusieurs lignes
await this.prisma.calcul.findMany({
  orderBy: { createdAt: 'desc' }, // trier : 'asc' croissant, 'desc' décroissant
  take: 10,                       // en prendre 10 maximum
});
```
Le nom après `this.prisma.` est celui du modèle, avec une minuscule. `id` et `createdAt` sont remplis par la base, pas besoin de les donner.

#### Le service
```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CalculService {
    // on demande à Nest de nous donner le service Prisma
    constructor(private readonly prisma: PrismaService) { }

    async sumNumbers(n1: number, n2: number): Promise<number> {
        const result = n1 + n2;
        // on enregistre le calcul dans la table Calcul
        await this.prisma.calcul.create({
            data: { first: n1, second: n2, result: result },
        });
        return result;
    }

    async getHistory() {
        // les 10 derniers calculs, du plus récent au plus ancien
        return this.prisma.calcul.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10,
        });
    }
}
```

#### Le controller
```ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CalculService } from './calcul.service.js';
import { SumDto } from './dto/sum.dto.js';

@Controller('calcul')
export class CalculController {
    constructor(private readonly calculService: CalculService) { }

    // POST /calcul
    @Post()
    async postSum(@Body() numbers: SumDto): Promise<{ resultat: number }> {
        // le service renvoie une promesse : on attend le résultat
        const result = await this.calculService.sumNumbers(numbers.first, numbers.second);
        return { resultat: result };
    }

    // GET /calcul/historique
    @Get('historique')
    getHistory() {
        // pas besoin d'await ici : Nest attend lui-même la promesse avant de répondre
        return this.calculService.getHistory();
    }
}
```

#### Test
```bash
curl -X POST http://localhost:3000/calcul -H "Content-Type: application/json" -d '{"first":2,"second":3}'
curl -X POST http://localhost:3000/calcul -H "Content-Type: application/json" -d '{"first":10,"second":4.5}'
curl http://localhost:3000/calcul/historique
```
La dernière commande renvoie une liste des calculs, avec leur `id` et leur date :
```json
[
  { "id": 2, "first": 10, "second": 4.5, "result": 14.5, "createdAt": "2026-11-17T16:20:00.000Z" },
  { "id": 1, "first": 2, "second": 3, "result": 5, "createdAt": "2026-11-17T16:19:00.000Z" }
]
```
On peut aussi vérifier directement dans `psql` :
```sql
SELECT * FROM "Calcul";
```
(les guillemets sont obligatoires parce que le nom de la table contient une majuscule)

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
### La base de données
- `docker start test-postgres` : lancer la base (par exemple après avoir redémarré le PC) ;
- `docker stop test-postgres` : l'arrêter (les données sont gardées) ;
- `docker ps -a` : voir tous les conteneurs, même arrêtés ;
- `docker exec -it test-postgres psql -U admin -d calcul` : entrer dans la base.

### Prisma
Dans le dossier `api` :
- `npx prisma migrate dev --name <description>` : appliquer une modification du schéma à la base ;
- `npx prisma generate` : mettre à jour le code TypeScript après une modification du schéma ;
- après un `git pull` qui modifie `schema.prisma`, on relance ces deux commandes.