<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const menuOpen = ref(false);

const navLinks = computed(() => [
  { to: '/enquetes', label: 'Enquêtes' },
  { to: '/comment-jouer', label: 'Comment jouer' },
  { to: '/tarifs', label: 'Tarifs' },
  ...(authStore.isAuthenticated
    ? [{ to: '/profil', label: 'Mon profil' }]
    : []),
]);

// Referme le menu mobile à chaque changement de page
watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false;
  },
);

function logout() {
  authStore.clearSession();
  menuOpen.value = false;
  router.push('/connexion');
}
</script>

<template>
  <div class="min-h-dvh bg-noir text-noir font-mono flex flex-col">
    <header class="relative bg-noir text-cream" @keydown.esc="menuOpen = false">
      <div class="flex justify-between items-center px-4 sm:px-6 lg:px-12 py-4">
        <div class="flex items-center gap-8">
          <router-link
            to="/enquetes"
            class="text-xl tracking-wider text-cream no-underline"
          >
            Case Prompt <span class="animate-pulse">_</span>
          </router-link>

          <!-- Navigation desktop -->
          <nav
            class="hidden md:flex gap-6 text-sm"
            aria-label="Navigation principale"
          >
            <router-link
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="text-cream no-underline hover:underline"
            >
              {{ link.label }}
            </router-link>
          </nav>
        </div>

        <!-- Actions desktop -->
        <div class="hidden md:flex items-center gap-6 text-sm">
          <template v-if="!authStore.isAuthenticated">
            <router-link
              to="/connexion"
              class="text-cream no-underline hover:underline"
            >
              Se connecter
            </router-link>
            <router-link
              to="/inscription"
              class="bg-[#f7e0b5] text-noir px-4 py-2 font-bold no-underline hover:opacity-90"
            >
              Créer un compte
            </router-link>
          </template>
          <template v-else>
            <span class="text-xs text-kraft max-w-[220px] truncate">
              {{ authStore.user?.email || 'Agent actif' }}
            </span>
            <button
              type="button"
              class="border border-cream text-cream px-3 py-1 text-xs cursor-pointer hover:bg-cream hover:text-noir transition-colors"
              @click="logout"
            >
              Déconnexion
            </button>
          </template>
        </div>

        <!-- Bouton burger (mobile) -->
        <button
          type="button"
          class="md:hidden p-2 -mr-2 text-cream cursor-pointer"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          :aria-label="menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
          @click="menuOpen = !menuOpen"
        >
          <svg
            class="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="square"
            aria-hidden="true"
          >
            <path v-if="!menuOpen" d="M3 6h18M3 12h18M3 18h18" />
            <path v-else d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>
      </div>

      <!-- Panneau mobile -->
      <div
        v-if="menuOpen"
        id="mobile-menu"
        class="md:hidden flex flex-col gap-1 px-4 sm:px-6 pb-5 pt-3 text-sm border-t border-cream/20"
      >
        <nav class="flex flex-col" aria-label="Navigation mobile">
          <router-link
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="py-3 text-cream no-underline"
          >
            {{ link.label }}
          </router-link>
        </nav>

        <div class="flex flex-col gap-3 pt-3 border-t border-cream/20">
          <template v-if="!authStore.isAuthenticated">
            <router-link to="/connexion" class="py-2 text-cream no-underline">
              Se connecter
            </router-link>
            <router-link
              to="/inscription"
              class="bg-[#f7e0b5] text-noir px-4 py-3 text-center font-bold no-underline"
            >
              Créer un compte
            </router-link>
          </template>
          <template v-else>
            <span class="text-xs text-kraft truncate">
              {{ authStore.user?.email || 'Agent actif' }}
            </span>
            <button
              type="button"
              class="border border-cream text-cream px-3 py-3 text-xs cursor-pointer hover:bg-cream hover:text-noir transition-colors"
              @click="logout"
            >
              Déconnexion
            </button>
          </template>
        </div>
      </div>
    </header>

    <router-view />
  </div>
</template>
