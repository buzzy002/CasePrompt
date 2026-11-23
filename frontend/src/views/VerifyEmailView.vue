<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const status = ref<'loading' | 'success' | 'error'>('loading')
const message = ref('')

onMounted(async () => {
  const token = route.query.token as string

  if (!token) {
    status.value = 'error'
    message.value = 'Jeton de validation manquant ou falsifié.'
    return
  }

  try {
    /*
      Appel vers l'API NestJS :
      const res = await fetch(`http://localhost:3000/api/auth/verify?token=${token}`)
      if (!res.ok) throw new Error('Jeton invalide ou expiré.')
    */

    // Simulation de validation
    await new Promise((resolve) => setTimeout(resolve, 1500))
    status.value = 'success'
  } catch (err: any) {
    status.value = 'error'
    message.value = err.message || 'Impossible d\'activer votre habilitation.'
  }
})
</script>

<template>
  <main class="page-container">
    <div class="verify-sheet">
      <div class="paperclip"></div>

      <div v-if="status === 'loading'">
        <p class="ref">DÉPARTEMENT CENTRAL // CONTRÔLE DES SCELLÉS</p>
        <h2>Vérification des accréditations en cours...</h2>
        <p class="meta">Veuillez patienter pendant l'examen de votre jeton de sécurité.</p>
      </div>

      <div v-else-if="status === 'success'">
        <div class="stamp-verified">HABILITATION CONFIRMÉE</div>
        <h2>Accréditation Validée</h2>
        <p class="meta">Votre dossier est désormais actif auprès de la Brigade Criminelle.</p>
        <router-link to="/connexion" class="btn-action">
          Accéder au terminal d'identification
        </router-link>
      </div>

      <div v-else class="error-box">
        <div class="stamp-denied">ACCÈS REFUSÉ</div>
        <h2>Échec de la validation</h2>
        <p class="meta">{{ message }}</p>
        <router-link to="/inscription" class="btn-action">
          Refaire une demande d'enrôlement
        </router-link>
      </div>
    </div>
  </main>
</template>

<style scoped>
.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px);
  padding: 20px;
}

.verify-sheet {
  background-color: #fbfbf9;
  max-width: 560px;
  width: 100%;
  padding: 44px 36px;
  text-align: center;
  position: relative;
  box-shadow: 0 10px 28px rgba(0,0,0,0.4);
  border: 1px solid #d9d2c5;
}

.paperclip {
  position: absolute;
  top: -16px;
  left: 36px;
  width: 16px;
  height: 50px;
  border: 2.5px solid #757b85;
  border-radius: 12px;
  background-color: transparent;
  box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.25);
  z-index: 10;
}

.ref {
  font-size: 0.75rem;
  letter-spacing: 1px;
  color: #635747;
  margin-bottom: 12px;
}

h2 {
  font-size: 1.6rem;
  font-weight: normal;
  margin: 10px 0;
}

.meta {
  font-size: 0.9rem;
  color: #4a4034;
  line-height: 1.5;
  margin-bottom: 28px;
}

.stamp-verified {
  border: 2px solid #2e7d32;
  color: #2e7d32;
  display: inline-block;
  padding: 4px 12px;
  font-size: 0.85rem;
  font-weight: bold;
  letter-spacing: 1.5px;
  transform: rotate(-3deg);
  margin-bottom: 16px;
}

.stamp-denied {
  border: 2px solid #b93b2a;
  color: #b93b2a;
  display: inline-block;
  padding: 4px 12px;
  font-size: 0.85rem;
  font-weight: bold;
  letter-spacing: 1.5px;
  transform: rotate(3deg);
  margin-bottom: 16px;
}

.btn-action {
  display: inline-block;
  background-color: #1a1613;
  color: #fff4db;
  text-decoration: none;
  padding: 12px 24px;
  font-size: 0.9rem;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.btn-action:hover {
  background-color: #332d27;
}
</style>