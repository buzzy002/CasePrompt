<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  alias: '',
  email: '',
  badgeNumber: '',
  password: '',
  confirmPassword: '',
  termsAccepted: false
})

const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''

  if (form.password !== form.confirmPassword) {
    error.value = 'Les codes d\'accès ne correspondent pas.'
    return
  }

  if (!form.termsAccepted) {
    error.value = 'Vous devez signer la clause de confidentialité.'
    return
  }

  loading.value = true
  try {
    // Connexion avec l'API NestJS (ex: POST /auth/register)
    console.log('Inscription inspecteur :', form)
    
    // Redirection vers les enquêtes après succès
    router.push('/enquetes')
  } catch (e: any) {
    error.value = e.message || 'Échec de l\'enrôlement.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="page-container">
    <div class="register-file">
      <div class="paperclip"></div>
      
      <div class="file-header">
        <div class="meta-info">
          <span>DIVISION CRIMINELLE</span>
          <span>FICHE N° RG-882</span>
        </div>
        <div class="stamp-recruit">NOUVELLE RECRUE</div>
      </div>

      <h1 class="file-title">DOSSIER D'ENRÔLEMENT</h1>
      <p class="file-subtitle">Créez votre matricule pour accéder aux rapports de scène de crime.</p>

      <div v-if="error" class="error-strip">
        [!] {{ error }}
      </div>

      <form @submit.prevent="handleSubmit" class="record-form">
        <div class="form-row">
          <div class="field">
            <label>Nom de code / Alias</label>
            <input type="text" v-model="form.alias" placeholder="Ex. Inspecteur Vance" required />
          </div>

          <div class="field">
            <label>Matricule souhaité (Optionnel)</label>
            <input type="text" v-model="form.badgeNumber" placeholder="Ex. CP-904" />
          </div>
        </div>

        <div class="field">
          <label>Courriel officiel</label>
          <input type="email" v-model="form.email" placeholder="agent@caseprompt.org" required />
        </div>

        <div class="form-row">
          <div class="field">
            <label>Code d'accès secret</label>
            <input type="password" v-model="form.password" placeholder="••••••••••••" required />
          </div>

          <div class="field">
            <label>Confirmer le code</label>
            <input type="password" v-model="form.confirmPassword" placeholder="••••••••••••" required />
          </div>
        </div>

        <label class="checkbox-field">
          <input type="checkbox" v-model="form.termsAccepted" />
          <span class="box"></span>
          <span>Je m'engage au secret professionnel concernant les enquêtes en cours.</span>
        </label>

        <div class="form-footer">
          <button type="submit" class="btn-stamp" :disabled="loading">
            {{ loading ? 'Validation du dossier...' : 'Sceller & Créer mon dossier' }}
          </button>
          
          <router-link to="/connexion" class="login-link">
            Déjà matriculé ? S'identifier au poste
          </router-link>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped>
.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px 80px;
}

.register-file {
  background-color: #fbfbf9;
  max-width: 650px;
  width: 100%;
  padding: 44px 40px 36px;
  position: relative;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid #d9d2c5;
}

.paperclip {
  position: absolute;
  top: -18px;
  left: 40px;
  width: 16px;
  height: 52px;
  border: 2.5px solid #757b85;
  border-radius: 12px;
  background-color: transparent;
  box-shadow: 1px 2px 4px rgba(0,0,0,0.25);
  z-index: 10;
}

.file-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.meta-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.8rem;
  color: #635747;
  letter-spacing: 1px;
}

.stamp-recruit {
  border: 2px solid #b93b2a;
  color: #b93b2a;
  padding: 4px 10px;
  font-size: 0.85rem;
  font-weight: bold;
  letter-spacing: 1.5px;
  transform: rotate(4deg);
}

.file-title {
  font-size: 1.8rem;
  font-weight: normal;
  letter-spacing: -0.5px;
  margin: 0 0 6px 0;
}

.file-subtitle {
  font-size: 0.9rem;
  color: #5a5043;
  margin: 0 0 28px 0;
}

.error-strip {
  background-color: #fbeae8;
  border-left: 3px solid #b93b2a;
  color: #b93b2a;
  padding: 8px 12px;
  font-size: 0.85rem;
  margin-bottom: 20px;
}

.record-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 0.8rem;
  font-weight: bold;
}

.field input {
  background: transparent;
  border: none;
  border-bottom: 1.5px solid #141414;
  padding: 8px 2px;
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
}

.field input:focus {
  border-bottom-color: #b93b2a;
}

.checkbox-field {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.8rem;
  cursor: pointer;
  margin-top: 6px;
}

.checkbox-field input {
  display: none;
}

.checkbox-field .box {
  width: 14px;
  height: 14px;
  border: 1.5px solid #141414;
  display: inline-block;
  position: relative;
}

.checkbox-field input:checked + .box::after {
  content: '✓';
  position: absolute;
  top: -3px;
  left: 2px;
  font-size: 12px;
  font-weight: bold;
}

.form-footer {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 14px;
}

.btn-stamp {
  background-color: #1a1613;
  color: #fff4db;
  border: none;
  padding: 13px;
  font-family: inherit;
  font-size: 0.95rem;
  cursor: pointer;
  letter-spacing: 0.5px;
}

.btn-stamp:hover:not(:disabled) {
  background-color: #2e2722;
}

.btn-stamp:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  font-size: 0.85rem;
  color: #4b4132;
  text-decoration: underline;
  text-underline-offset: 4px;
}

@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
  }
}
</style>