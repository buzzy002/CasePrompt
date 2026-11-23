<script setup lang="ts">
import { ref } from 'vue'
import AuthView from './views/AuthView.vue'

// Gestion de la vue active
const currentView = ref<'game' | 'auth'>('game')
const initialAuthMode = ref(true)

function openAuth(login: boolean) {
  initialAuthMode.value = login
  currentView.value = 'auth'
}

// Données du jeu
const declaration = ref('')
const scelles = ref([
  { id: 1, label: 'Clé en laiton', checked: false },
  { id: 2, label: 'Couteau', checked: false }
])

function submitDeclaration() {
  if (!declaration.value.trim()) return
  console.log('Action soumise :', declaration.value)
  declaration.value = ''
}
</script>

<template>
  <div class="case-prompt-app">
    <!-- Barre de navigation -->
    <header class="navbar">
      <div class="nav-left">
        <span class="logo" @click="currentView = 'game'" style="cursor: pointer;">
          Case Prompt <span class="cursor">_</span>
        </span>
        <nav class="nav-links">
          <a href="#" :class="{ active: currentView === 'game' }" @click.prevent="currentView = 'game'">Enquêtes</a>
          <a href="#">Comment jouer</a>
          <a href="#">Tarifs</a>
        </nav>
      </div>

      <!-- ÉTAPE 2 : Liens de connexion / inscription branchés ici -->
      <div class="nav-right">
        <a href="#" class="btn-link" @click.prevent="openAuth(true)">Se connecter</a>
        <button class="btn-account" @click="openAuth(false)">Créer un compte</button>
      </div>
    </header>

    <!-- ÉTAPE 3 : Affichage conditionnel de la page d'authentification OU du jeu -->
    <AuthView
      v-if="currentView === 'auth'"
      @success="currentView = 'game'"
    />

    <main v-else class="workspace">
      <!-- Onglets du dossier -->
      <div class="folder-tabs">
        <button class="tab active">AFFAIRE N°001</button>
        <button class="tab">Résolution</button>
      </div>

      <!-- Corps du dossier kraft -->
      <div class="folder-body">
        <div class="folder-left-col">
          <div class="case-header">
            <div>
              <p class="case-meta">Bureau du PDG · nuit du 12 novembre</p>
              <h1 class="case-title">Mort au dernier étage</h1>
            </div>
            <div class="stamp-en-cours">EN COURS</div>
          </div>

          <div class="scene-viewer">
            <div class="scene-placeholder">
              <p class="scene-title">[ Image de la scène ]</p>
              <p class="scene-desc">
                Bureau du PDG : grand bureau en bois avec un tiroir, porte des archives au fond, fenêtre sur la ville la nuit.
              </p>
            </div>
          </div>

          <div class="scelles-section">
            <h3 class="scelles-title">Scellés</h3>
            <div class="scelles-tags">
              <label v-for="item in scelles" :key="item.id" class="scelle-badge">
                <input type="checkbox" v-model="item.checked" />
                <span class="custom-radio"></span>
                <span>{{ item.label }}</span>
              </label>

              <div class="scelle-badge-dashed">
                À trouver
              </div>
            </div>
          </div>
        </div>

        <!-- Document papier : Procès-Verbal -->
        <aside class="paper-pv">
          <div class="paperclip"></div>

          <h2 class="pv-title">PROCÈS-VERBAL</h2>

          <div class="pv-history">
            <div class="pv-entry">
              <p class="speaker"><strong>— Vous :</strong> je fouille le tiroir du bureau.</p>
              <p class="narrative">
                Le tiroir glisse sans résistance. Sous une pile de factures, quelque chose brille.
              </p>
              <p class="action-alert">Saisi : une clé en laiton et un couteau.</p>
            </div>

            <div class="pv-entry">
              <p class="speaker"><strong>— Vous :</strong> je défonce la porte des archives d'un coup de pied.</p>
              <p class="narrative">
                Vous prenez votre élan... mais votre cheville vous lâche avant l'impact. La porte n'a même pas tremblé.
              </p>
            </div>

            <div class="stamp-ia">RÉDIGÉ PAR IA</div>
          </div>

          <div class="pv-input-section">
            <label class="input-label">Déclaration suivante :</label>
            <div class="input-group">
              <input
                type="text"
                v-model="declaration"
                placeholder="J'examine l'armoire..."
                @keyup.enter="submitDeclaration"
              />
              <button class="btn-signer" @click="submitDeclaration">Signer</button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Conservez exactement le bloc <style scoped> du premier composant d'enquête */
@import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap');

.case-prompt-app {
  min-height: 100vh;
  background-color: #1a1613;
  color: #141414;
  font-family: 'Courier Prime', Courier, monospace;
  display: flex;
  flex-direction: column;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 48px;
  background-color: #1a1613;
  color: #fff4db;
}

.nav-left, .nav-right {
  display: flex;
  align-items: center;
  gap: 32px;
}

.logo {
  font-size: 1.35rem;
  letter-spacing: 0.5px;
}

.cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.nav-links a, .btn-link {
  color: #fff4db;
  text-decoration: none;
  font-size: 0.95rem;
}

.nav-links a.active {
  text-decoration: underline;
  text-underline-offset: 6px;
}

.btn-account {
  background-color: #f7e0b5;
  color: #1a1613;
  border: none;
  padding: 9px 18px;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}

.workspace {
  max-width: 1400px;
  width: 95%;
  margin: 10px auto 40px auto;
  position: relative;
}

.folder-tabs {
  display: flex;
  gap: 4px;
}

.tab {
  background-color: #cbb384;
  border: none;
  padding: 8px 24px;
  font-family: inherit;
  font-size: 0.95rem;
  cursor: pointer;
  border-radius: 6px 6px 0 0;
  color: #2b251d;
}

.tab.active {
  background-color: #dec594;
  font-weight: 700;
}

.folder-body {
  background-color: #dec594;
  border-radius: 0 12px 12px 12px;
  padding: 28px 32px;
  display: grid;
  grid-template-columns: 1fr 390px;
  gap: 36px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  position: relative;
}

.case-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.case-meta {
  font-size: 0.9rem;
  color: #4b4132;
  margin: 0 0 4px 0;
}

.case-title {
  font-size: 2.2rem;
  font-weight: normal;
  margin: 0;
  letter-spacing: -0.5px;
}

.stamp-en-cours {
  border: 2px solid #b93b2a;
  color: #b93b2a;
  padding: 6px 14px;
  font-size: 1.1rem;
  font-weight: bold;
  transform: rotate(3deg);
  letter-spacing: 1.5px;
  border-radius: 2px;
}

.scene-viewer {
  background-color: #12100e;
  border-radius: 4px;
  min-height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  border: 2px solid #4a3e2e;
}

.scene-placeholder {
  color: #d1b88a;
  text-align: center;
  max-width: 520px;
}

.scene-title {
  font-size: 1.25rem;
  margin-bottom: 12px;
}

.scene-desc {
  font-size: 0.95rem;
  line-height: 1.6;
}

.scelles-section {
  margin-top: 24px;
}

.scelles-title {
  font-size: 1.05rem;
  margin: 0 0 12px 0;
  font-weight: normal;
}

.scelles-tags {
  display: flex;
  gap: 12px;
}

.scelle-badge {
  background-color: #ffffff;
  border-radius: 20px;
  padding: 6px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.06);
}

.scelle-badge input {
  display: none;
}

.custom-radio {
  width: 12px;
  height: 12px;
  border: 1.5px solid #222;
  border-radius: 50%;
  display: inline-block;
}

.scelle-badge input:checked + .custom-radio {
  background-color: #222;
}

.scelle-badge-dashed {
  border: 1.5px dashed #73644f;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 0.85rem;
  color: #574b3a;
}

.paper-pv {
  background-color: #fcfcfc;
  padding: 30px 24px 20px 24px;
  border-radius: 2px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transform: rotate(0.8deg);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 600px;
}

.paperclip {
  position: absolute;
  top: -18px;
  left: 36px;
  width: 16px;
  height: 52px;
  border: 2.5px solid #757b85;
  border-radius: 12px;
  background-color: transparent;
  box-shadow: 1px 2px 4px rgba(0,0,0,0.25);
  z-index: 10;
}

.pv-title {
  text-align: center;
  font-size: 1.25rem;
  letter-spacing: 1.5px;
  margin: 10px 0 20px 0;
}

.pv-history {
  flex-grow: 1;
  font-size: 0.85rem;
  line-height: 1.55;
  position: relative;
}

.pv-entry {
  margin-bottom: 22px;
}

.pv-entry .narrative {
  margin: 8px 0;
  color: #333;
}

.action-alert {
  color: #b93b2a;
  font-weight: bold;
}

.stamp-ia {
  position: absolute;
  right: 0;
  bottom: 10px;
  border: 1.5px solid #b93b2a;
  color: #b93b2a;
  font-size: 0.75rem;
  padding: 4px 8px;
  transform: rotate(-6deg);
  letter-spacing: 0.8px;
  opacity: 0.9;
}

.pv-input-section {
  border-top: 1.5px dashed #888;
  padding-top: 14px;
  margin-top: 16px;
}

.input-label {
  display: block;
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.input-group {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.input-group input {
  flex-grow: 1;
  background: transparent;
  border: none;
  border-bottom: 1.5px solid #141414;
  padding: 6px 4px;
  font-family: inherit;
  font-size: 0.85rem;
  outline: none;
}

.btn-signer {
  background-color: #1a1613;
  color: #fff;
  border: none;
  padding: 8px 16px;
  font-family: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  letter-spacing: 0.5px;
}

.btn-signer:hover {
  background-color: #332d27;
}

@media (max-width: 1024px) {
  .folder-body {
    grid-template-columns: 1fr;
  }
  .paper-pv {
    transform: none;
  }
}
</style>