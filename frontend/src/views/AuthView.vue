<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isLoginMode = ref(true)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const loading = ref(false)

async function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!isLoginMode.value && password.value !== confirmPassword.value) {
    errorMessage.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  loading.value = true
  try {
    if (isLoginMode.value) {
      await authStore.login(email.value, password.value)
      // Redirection immédiate vers le jeu après connexion réussie
      router.push('/enquetes')
    } else {
      await authStore.register(email.value, password.value)
      successMessage.value = 'Dossier créé. Vous pouvez maintenant vous identifier.'
      isLoginMode.value = true
      password.value = ''
      confirmPassword.value = ''
    }
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Identifiants invalides ou service indisponible.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-noir font-mono">
    <div class="relative w-full max-w-md bg-[#fbfbf9] border border-[#d9d2c5] shadow-2xl p-8 sm:p-10">
      
      <!-- Trombone décoratif -->
      <div class="absolute -top-4 left-8 w-4 h-14 border-[2.5px] border-[#757b85] rounded-xl pointer-events-none shadow-sm"></div>

      <!-- En-tête -->
      <div class="flex justify-between items-start mb-6">
        <div>
          <p class="text-xs tracking-widest text-[#635747]">BUREAU DE POLICE</p>
          <p class="text-xs text-[#8a7a67]">CONTRÔLE D'ACCÈS</p>
        </div>
        <div class="border-2 border-stamp text-stamp text-xs px-2 py-0.5 font-bold tracking-wider rotate-2">
          {{ isLoginMode ? 'IDENTIFICATION' : 'OUVERTURE' }}
        </div>
      </div>

      <h1 class="text-2xl text-noir mb-2 font-normal">
        {{ isLoginMode ? 'Connexion au poste' : 'Création de matricule' }}
      </h1>
      <p class="text-xs text-[#5a5043] mb-6">
        {{ isLoginMode ? 'Saisissez vos codes d\'habilitation pour ouvrir vos dossiers.' : 'Renseignez vos identifiants pour rejoindre la brigade.' }}
      </p>

      <!-- Onglets Connexion / Créer un compte -->
      <div class="flex border-b border-[#d9d2c5] mb-6">
        <button
          type="button"
          class="flex-1 pb-2 text-sm text-center border-b-2 font-bold cursor-pointer transition-colors"
          :class="isLoginMode ? 'border-noir text-noir' : 'border-transparent text-[#8a7a67] hover:text-noir'"
          @click="isLoginMode = true; errorMessage = ''; successMessage = ''"
        >
          Se connecter
        </button>
        <button
          type="button"
          class="flex-1 pb-2 text-sm text-center border-b-2 font-bold cursor-pointer transition-colors"
          :class="!isLoginMode ? 'border-noir text-noir' : 'border-transparent text-[#8a7a67] hover:text-noir'"
          @click="isLoginMode = false; errorMessage = ''; successMessage = ''"
        >
          Créer un compte
        </button>
      </div>

      <!-- Bannières messages -->
      <div v-if="errorMessage" class="bg-[#fbeae8] border-l-4 border-stamp text-stamp text-xs p-3 mb-4">
        [!] {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="bg-[#e8f5e9] border-l-4 border-green-700 text-green-800 text-xs p-3 mb-4">
        [✓] {{ successMessage }}
      </div>

      <!-- Formulaire -->
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-noir">Courriel officiel</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="agent@caseprompt.org"
            class="bg-transparent border-b-2 border-noir p-2 text-sm outline-none focus:border-stamp transition-colors"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-noir">Code secret</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••••••"
            class="bg-transparent border-b-2 border-noir p-2 text-sm outline-none focus:border-stamp transition-colors"
          />
        </div>

        <div v-if="!isLoginMode" class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-noir">Confirmer le code</label>
          <input
            v-model="confirmPassword"
            type="password"
            required
            placeholder="••••••••••••"
            class="bg-transparent border-b-2 border-noir p-2 text-sm outline-none focus:border-stamp transition-colors"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="mt-4 bg-noir text-cream py-3 text-sm font-bold tracking-wide cursor-pointer hover:bg-[#332d27] disabled:opacity-50 transition-colors"
        >
          {{ loading ? 'Vérification...' : (isLoginMode ? 'Valider et entrer' : 'Créer le dossier') }}
        </button>
      </form>
    </div>
  </main>
</template>