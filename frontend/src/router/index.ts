import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// Chargement paresseux : chaque vue est téléchargée seulement quand on la visite
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/enquetes',
  },
  {
    path: '/enquetes',
    name: 'enquetes',
    component: () => import('../views/EnqueteView.vue'),
    meta: { requiresAuth: true, title: 'Enquêtes' },
  },
  {
    path: '/profil',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { requiresAuth: true, title: 'Profil' },
  },
  {
    path: '/comment-jouer',
    name: 'how-to-play',
    component: () => import('../views/HowToPlayView.vue'),
    meta: { title: 'Comment jouer' },
  },
  {
    path: '/tarifs',
    name: 'tarifs',
    component: () => import('../views/PricingView.vue'),
    meta: { title: 'Tarifs' },
  },
  {
    path: '/connexion',
    name: 'login',
    component: () => import('../views/AuthView.vue'),
    props: { initialMode: 'login' },
    meta: { title: 'Connexion' },
  },
  {
    path: '/inscription',
    name: 'register',
    component: () => import('../views/AuthView.vue'),
    props: { initialMode: 'register' },
    meta: { title: 'Inscription' },
  },
  {
    path: '/verifier-email',
    name: 'verify-email',
    component: () => import('../views/VerifyEmailView.vue'),
    meta: { title: 'Vérification de l\'e-mail' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: 'Page introuvable' },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  // Revient en haut de page à chaque navigation
  scrollBehavior() {
    return { top: 0 };
  },
});

// Redirection vers /connexion si l'agent n'a pas de session
router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }
  if (
    (to.name === 'login' || to.name === 'register') &&
    authStore.isAuthenticated
  ) {
    return '/enquetes';
  }
});

// Titre de l'onglet du navigateur selon la page
router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} · Case Prompt`
    : 'Case Prompt';
});