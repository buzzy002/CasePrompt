<script setup lang="ts">
import { ref, reactive } from 'vue'

const emit = defineEmits<{
  (e: 'success', user: { email: string; matricule?: string }): void
  (e: 'close'): void
}>()

const isLogin = ref(true)
const errorMessage = ref('')
const isLoading = ref(false)

const loginForm = reactive({
  email: '',
  password: ''
})

const registerForm = reactive({
  alias: '',
  email: '',
  matricule: '',
  password: '',
  confirmPassword: ''
})

function switchMode(loginMode: boolean) {
  isLogin.value = loginMode
  errorMessage.value = ''
}

async function handleSubmit() {
  errorMessage.value = ''
  isLoading.value = true

  try {
    if (isLogin.value) {
      if (!loginForm.email || !loginForm.password) {
        throw new Error('Veuillez renseigner vos identifiants.')
      }
      console.log('Connexion :', loginForm)
      emit('success', { email: loginForm.email })
    } else {
      if (!registerForm.alias || !registerForm.email || !registerForm.password) {
        throw new Error('Veuillez compléter tous les champs requis.')
      }
      if (registerForm.password !== registerForm.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas.')
      }
      console.log('Inscription :', registerForm)
      emit('success', { email: registerForm.email, matricule: registerForm.matricule })
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'Une erreur est survenue.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="auth-overlay">
    <div class="dossier-card">
      <div class="paperclip"></div>

      <div class="folder-tabs">
        <button
          type="button"
          class="tab"
          :class="{ active: isLogin }"
          @click="switchMode(true)"
        >
          IDENTIFICATION
        </button>
        <button
          type="button"
          class="tab"
          :class="{ active: !isLogin }"
          @click="switchMode(false)"
        >
          OUVERTURE DE DOSSIER
        </button>
      </div>

      <div class="paper-sheet">
        <div class="stamp-confidentiel">
          {{ isLogin ? 'ACCÈS RESTREINT' : 'NOUVEL AGENT' }}
        </div>

        <div class="header">
          <p class="reference">RÉF. DÉPARTEMENT 001 // BRIGADE CRIMINELLE</p>
          <h2 class="title">
            {{ isLogin ? 'Procédure de Connexion' : 'Enregistrement Enquêteur' }}
          </h2>
        </div>

        <div v-if="errorMessage" class="error-banner">
          [!] {{ errorMessage }}
        </div>

        <form v-if="isLogin" @submit.prevent="handleSubmit" class="auth-form">
          <div class="field-group">
            <label>Identifiant / Courriel :</label>
            <input
              type="email"
              v-model="loginForm.email"
              placeholder="inspecteur@caseprompt.local"
              required
            />
          </div>

          <div class="field-group">
            <label>Code de sécurité (Mot de passe) :</label>
            <input
              type="password"
              v-model="loginForm.password"
              placeholder="••••••••••••"
              required
            />
          </div>

          <div class="actions">
            <button type="submit" class="btn-submit" :disabled="isLoading">
              {{ isLoading ? 'Vérification...' : "Valider l'accès" }}
            </button>
            <button type="button" class="link-switch" @click="switchMode(false)">
              Pas encore matriculé ? Créez votre dossier
            </button>
          </div>
        </form>

        <form v-else @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-row">
            <div class="field-group">
              <label>Nom de code / Alias :</label>
              <input
                type="text"
                v-model="registerForm.alias"
                placeholder="Ex. L'Horloger"
                required
              />
            </div>
            <div class="field-group">
              <label>Matricule (optionnel) :</label>
              <input
                type="text"
                v-model="registerForm.matricule"
                placeholder="CP-770"
              />
            </div>
          </div>

          <div class="field-group">
            <label>Courriel officiel :</label>
            <input
              type="email"
              v-model="registerForm.email"
              placeholder="agent@caseprompt.local"
              required
            />
          </div>

          <div class="form-row">
            <div class="field-group">
              <label>Mot de passe :</label>
              <input
                type="password"
                v-model="registerForm.password"
                placeholder="••••••••••••"
                required
              />
            </div>
            <div class="field-group">
              <label>Confirmer le mot de passe :</label>
              <input
                type="password"
                v-model="registerForm.confirmPassword"
                placeholder="••••••••••••"
                required
              />
            </div>
          </div>

          <div class="actions">
            <button type="submit" class="btn-submit" :disabled="isLoading">
              {{ isLoading ? 'Création en cours...' : "Signer l'engagement" }}
            </button>
            <button type="button" class="link-switch" @click="switchMode(true)">
              Déjà enregistré ? S'identifier
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap');

.auth-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  min-height: calc(100vh - 80px);
  font-family: 'Courier Prime', Courier, monospace;
}

.dossier-card {
  position: relative;
  width: 100%;
  max-width: 580px;
}

.paperclip {
  position: absolute;
  top: -16px;
  left: 32px;
  width: 16px;
  height: 50px;
  border: 2.5px solid #757b85;
  border-radius: 12px;
  background-color: transparent;
  box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.35);
  z-index: 20;
}

.folder-tabs {
  display: flex;
  gap: 4px;
  position: relative;
  z-index: 1;
}

.tab {
  background-color: #cbb384;
  border: none;
  padding: 10px 20px;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: bold;
  letter-spacing: 0.5px;
  color: #3b3225;
  cursor: pointer;
  border-radius: 6px 6px 0 0;
  transition: background-color 0.15s;
}

.tab.active {
  background-color: #fcfcfc;
  color: #141414;
}

.paper-sheet {
  background-color: #fcfcfc;
  padding: 40px 36px 32px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.45);
  border-radius: 0 8px 8px 8px;
  position: relative;
  color: #141414;
}

.stamp-confidentiel {
  position: absolute;
  top: 25px;
  right: 25px;
  border: 2px solid #b93b2a;
  color: #b93b2a;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 4px 10px;
  letter-spacing: 1.5px;
  transform: rotate(4deg);
  opacity: 0.9;
  user-select: none;
}

.header {
  margin-bottom: 24px;
}

.reference {
  font-size: 0.75rem;
  color: #635747;
  margin: 0 0 6px 0;
  letter-spacing: 0.5px;
}

.title {
  font-size: 1.5rem;
  font-weight: normal;
  margin: 0;
  letter-spacing: -0.5px;
}

.error-banner {
  background-color: #fbeae8;
  border-left: 3px solid #b93b2a;
  color: #b93b2a;
  padding: 8px 12px;
  font-size: 0.85rem;
  margin-bottom: 20px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-row .field-group {
  flex: 1;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-group label {
  font-size: 0.85rem;
  font-weight: bold;
}

.field-group input {
  background: transparent;
  border: none;
  border-bottom: 1.5px solid #141414;
  padding: 8px 4px;
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
  color: #141414;
}

.field-group input:focus {
  border-bottom: 2px solid #b93b2a;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 10px;
}

.btn-submit {
  background-color: #1a1613;
  color: #ffffff;
  border: none;
  padding: 12px;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: background-color 0.15s;
}

.btn-submit:hover:not(:disabled) {
  background-color: #38312b;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.link-switch {
  background: none;
  border: none;
  color: #4b4132;
  font-family: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 4px;
  padding: 4px;
}

.link-switch:hover {
  color: #141414;
}

@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
  }
  .paper-sheet {
    padding: 24px 18px;
  }
}
</style>