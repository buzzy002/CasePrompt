import { createRouter, createWebHistory } from 'vue-router'
import EnqueteView from '../views/EnqueteView.vue'
import HowToPlayView from '../views/HowToPlayView.vue'
import PricingView from '../views/PricingView.vue'
import AuthView from '../views/AuthView.vue'
import VerificationView from '../views/VerifyEmailView.vue'

const routes = [
  { path: '/', redirect: '/enquetes' },
  { path: '/enquetes', name: 'enquetes', component: EnqueteView },
  { path: '/comment-jouer', name: 'how-to-play', component: HowToPlayView },
  { path: '/tarifs', name: 'tarifs', component: PricingView },
  { path: '/connexion', name: 'login', component: AuthView, props: { initialMode: 'login' } },
  { path: '/inscription', name: 'register', component: AuthView, props: { initialMode: 'register' } },
  { path: '/verifier-email', name: 'verify-email', component: VerificationView, props: { initialMode: 'verify-email' } }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})