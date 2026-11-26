# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).


# Case Prompt — Frontend

Interface web du jeu d'enquête Case Prompt (Vue 3, TypeScript, Vite, Tailwind CSS v4, Pinia).

## Démarrage

    cp .env.example .env     # puis renseigner VITE_API_URL
    npm install
    npm run dev              # http://localhost:5173

## Scripts

- `npm run dev` : serveur de développement
- `npm run build` : vérification des types (vue-tsc) puis build de production
- `npm run preview` : prévisualise le build

## Structure

- `src/views/` : pages (enquête, auth, profil, tarifs…)
- `src/components/common/` : composants réutilisables (BaseButton, BaseInput, PaperCard)
- `src/stores/` : état global Pinia (authentification)
- `src/services/api.ts` : client Axios (JWT, gestion du 401)
- `src/router/` : routes et guards (redirection après connexion)

## Backend attendu

`/auth/login`, `/auth/register`, `/auth/verify-email`, `/users/me`, `/users/me/password`,
`/api/investigation/action`. L'API doit autoriser l'origine du front (CORS).