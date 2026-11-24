<script setup lang="ts">
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function logout() {
  authStore.clearSession()
  router.push('/connexion')
}
</script>

<template>
  <div class="min-h-screen bg-noir text-[#141414] font-mono flex flex-col">
    <header class="flex justify-between items-center px-12 py-4 bg-noir text-cream">
      <div class="flex items-center gap-8">
        <router-link to="/enquetes" class="text-xl tracking-wider text-cream no-underline">
          Case Prompt <span class="animate-pulse">_</span>
        </router-link>
        <nav class="flex gap-6 text-sm">
          <router-link to="/enquetes" class="text-cream no-underline hover:underline">Enquêtes</router-link>
          <router-link to="/comment-jouer" class="text-cream no-underline hover:underline">Comment jouer</router-link>
          <router-link to="/tarifs" class="text-cream no-underline hover:underline">Tarifs</router-link>
        </nav>
      </div>

      <div class="flex items-center gap-6 text-sm">
        <template v-if="!authStore.isAuthenticated">
          <router-link to="/connexion" class="text-cream no-underline hover:underline">Se connecter</router-link>
          <router-link to="/connexion" class="bg-[#f7e0b5] text-noir px-4 py-2 font-bold no-underline hover:opacity-90">Créer un compte</router-link>
        </template>
        <template v-else>
          <span class="text-xs text-kraft">{{ authStore.user?.email || 'Agent actif' }}</span>
          <button @click="logout" class="border border-cream text-cream px-3 py-1 text-xs cursor-pointer hover:bg-cream hover:text-noir transition-colors">
            Déconnexion
          </button>
        </template>
      </div>
    </header>

    <router-view />
  </div>
</template>