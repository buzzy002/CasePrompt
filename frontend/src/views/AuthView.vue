<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import BaseButton from '../components/common/BaseButton.vue'
import BaseInput from '../components/common/BaseInput.vue'
import PaperCard from '../components/common/PaperCard.vue'

const props = withDefaults(
  defineProps<{
    initialMode?: 'login' | 'register'
  }>(),
  {
    initialMode: 'login'
  }
)

const router = useRouter()
const authStore = useAuthStore()

const isLoginMode = ref(props.initialMode === 'login')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const loading = ref(false)

// Met à jour le formulaire si l'utilisateur navigue entre /connexion et /inscription sans rechargement
watch(
  () => props.initialMode,
  (newMode) => {
    isLoginMode.value = newMode === 'login'
    errorMessage.value = ''
    successMessage.value = ''
  }
)

function setMode(login: boolean) {
  isLoginMode.value = login
  errorMessage.value = ''
  successMessage.value = ''
}

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
      router.push('/enquetes')
    } else {
      await authStore.register(email.value, password.value)
      successMessage.value = 'Pré-inscription validée. Consultez votre boîte mail pour activer votre matricule avant de vous connecter.'
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
  <main class="min-h-[calc(100dvh-80px)] flex items-center justify-center p-6 bg-noir font-mono">
    <div class="w-full max-w-md">
      <PaperCard>
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

        <div class="flex border-b border-[#d9d2c5] mb-6">
          <button
            type="button"
            class="flex-1 pb-2 text-sm text-center border-b-2 font-bold cursor-pointer transition-colors"
            :class="isLoginMode ? 'border-noir text-noir' : 'border-transparent text-[#8a7a67] hover:text-noir'"
            @click="setMode(true)"
          >
            Se connecter
          </button>
          <button
            type="button"
            class="flex-1 pb-2 text-sm text-center border-b-2 font-bold cursor-pointer transition-colors"
            :class="!isLoginMode ? 'border-noir text-noir' : 'border-transparent text-[#8a7a67] hover:text-noir'"
            @click="setMode(false)"
          >
            Créer un compte
          </button>
        </div>

        <div v-if="errorMessage" class="bg-[#fbeae8] border-l-4 border-stamp text-stamp text-xs p-3 mb-4">
          [!] {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="bg-[#e8f5e9] border-l-4 border-green-700 text-green-800 text-xs p-3 mb-4">
          [✓] {{ successMessage }}
        </div>

        <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
          <BaseInput
            v-model="email"
            type="email"
            label="Courriel officiel"
            placeholder="agent@caseprompt.org"
            required
          />

          <BaseInput
            v-model="password"
            type="password"
            label="Code secret"
            placeholder="••••••••••••"
            required
          />

          <BaseInput
            v-if="!isLoginMode"
            v-model="confirmPassword"
            type="password"
            label="Confirmer le code"
            placeholder="••••••••••••"
            required
          />

          <BaseButton type="submit" :disabled="loading" class="mt-4">
            {{ loading ? 'Vérification...' : (isLoginMode ? 'Valider et entrer' : 'Créer le dossier') }}
          </BaseButton>
        </form>
      </PaperCard>
    </div>
  </main>
</template>