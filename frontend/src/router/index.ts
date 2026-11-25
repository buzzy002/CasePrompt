import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import EnqueteView from '../views/EnqueteView.vue'
import HowToPlayView from '../views/HowToPlayView.vue'
import PricingView from '../views/PricingView.vue'
import AuthView from '../views/AuthView.vue'
import VerificationView from '../views/VerifyEmailView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
  { 
    path: '/', 
    redirect: '/enquetes' 
  },
  { 
    path: '/enquetes', 
    name: 'enquetes', 
    component: EnqueteView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/comment-jouer', 
    name: 'how-to-play', 
    component: HowToPlayView 
  },
  { 
    path: '/tarifs', 
    name: 'tarifs', 
    component: PricingView 
  },
  { 
    path: '/connexion', 
    name: 'login', 
    component: AuthView, 
    props: { initialMode: 'login' } 
  },
  { 
    path: '/inscription', 
    name: 'register', 
    component: AuthView, 
    props: { initialMode: 'register' } 
  },
  { 
    path: '/verifier-email', 
    name: 'verify-email', 
    component: VerificationView 
  },
  {
    path: '/:pathMatch(.*)*', 
    name: 'not-found', 
    component: NotFoundView 
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

// Redirection vers /connexion si l'agent n'a pas de session
router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return {name: 'login',query: { redirect: to.fullPath }}
  } 
  if ((to.name === 'login' || to.name === 'register') && authStore.isAuthenticated) {
    return '/enquetes'
  }
  
})