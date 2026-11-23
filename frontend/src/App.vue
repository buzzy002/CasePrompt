<script setup lang="ts">
// App.vue ne gère que le squelette global et la navigation
</script>

<template>
  <div class="case-prompt-app">
    <!-- Barre de navigation permanente -->
    <header class="navbar">
      <div class="nav-left">
        <router-link to="/enquetes" class="logo">
          Case Prompt <span class="cursor">_</span>
        </router-link>
        <nav class="nav-links">
          <router-link to="/enquetes">Enquêtes</router-link> |
          <router-link to="/comment-jouer">Comment jouer ?</router-link> |
          <router-link to="/tarifs">Tarifs</router-link>
        </nav>
      </div>

      <div class="nav-right">
        <router-link to="/connexion" class="btn-link">Se connecter</router-link>
        <router-link to="/inscription" class="btn-account">Créer un compte</router-link>
      </div>
    </header>

    <!-- Vue Router injecte la page demandée -->
    <router-view />
  </div>
</template>

<style scoped>
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
  color: #fff4db;
  text-decoration: none;
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

/* Classe automatiquement ajoutée par Vue Router sur la page active */
.nav-links .router-link-active {
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
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-account:hover {
  opacity: 0.9;
}
</style>