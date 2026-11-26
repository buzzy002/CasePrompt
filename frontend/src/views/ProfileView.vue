<script setup lang="ts">
import { ref } from 'vue';
import { isAxiosError } from 'axios';
import apiClient from '../services/api';
import { useAuthStore } from '../stores/auth';
import PaperCard from '../components/common/PaperCard.vue';
import BaseInput from '../components/common/BaseInput.vue';
import BaseButton from '../components/common/BaseButton.vue';

const authStore = useAuthStore();

// Formulaire Identité
const pseudo = ref('');
const email = ref(authStore.user?.email || '');
const profileLoading = ref(false);
const profileSuccess = ref('');
const profileError = ref('');

// Formulaire Mot de passe
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const passwordLoading = ref(false);
const passwordSuccess = ref('');
const passwordError = ref('');

function extractError(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    if (!err.response) {
      return 'Impossible de joindre le serveur. Vérifiez votre connexion.';
    }
    const msg = err.response.data?.message;
    return (Array.isArray(msg) ? msg.join(' ') : msg) || fallback;
  }
  return fallback;
}

async function updateProfile() {
  profileError.value = '';
  profileSuccess.value = '';

  // On n'envoie que ce qui a changé
  const payload: { pseudo?: string; email?: string } = {};
  const newPseudo = pseudo.value.trim();
  const newEmail = email.value.trim();
  if (newPseudo) payload.pseudo = newPseudo;
  if (newEmail && newEmail !== authStore.user?.email) payload.email = newEmail;

  if (Object.keys(payload).length === 0) {
    profileError.value = 'Aucune modification à enregistrer.';
    return;
  }

  profileLoading.value = true;
  try {
    await apiClient.patch('/users/me', payload);
    if (payload.email) authStore.updateEmail(payload.email);
    profileSuccess.value = "Fiche d'identification mise à jour.";
  } catch (err: unknown) {
    profileError.value = extractError(
      err,
      'Impossible de mettre à jour le profil.',
    );
  } finally {
    profileLoading.value = false;
  }
}

async function updatePassword() {
  passwordError.value = '';
  passwordSuccess.value = '';

  if (newPassword.value.length < 8) {
    passwordError.value =
      'Le nouveau code secret doit contenir au moins 8 caractères.';
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    passwordError.value =
      'La confirmation ne correspond pas au nouveau code secret.';
    return;
  }

  if (newPassword.value === currentPassword.value) {
    passwordError.value =
      "Le nouveau code secret doit être différent de l'actuel.";
    return;
  }

  passwordLoading.value = true;
  try {
    await apiClient.patch('/users/me/password', {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    });
    passwordSuccess.value = 'Code secret modifié avec succès.';
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (err: unknown) {
    passwordError.value = extractError(
      err,
      'Échec de la modification du code secret.',
    );
  } finally {
    passwordLoading.value = false;
  }
}
</script>

<template>
  <main class="flex-1 bg-noir font-mono py-8 px-4 sm:px-6">
    <div class="w-full max-w-2xl mx-auto flex flex-col gap-6">
      <!-- En-tête du dossier agent -->
      <div
        class="flex justify-between items-center border-b border-kraft/30 pb-4"
      >
        <div>
          <p class="text-xs tracking-widest text-kraft">
            DIRECTION DU PERSONNEL
          </p>
          <h1 class="text-2xl text-cream font-normal mt-1">
            Dossier de l'Agent
          </h1>
        </div>
        <div
          class="border-2 border-stamp-light text-stamp-light text-xs px-2.5 py-1 font-bold tracking-wider rotate-2"
        >
          HABILITÉ
        </div>
      </div>

      <!-- Bloc 1 : Identité -->
      <PaperCard>
        <h2 class="text-lg text-noir mb-1">Informations de service</h2>
        <p class="text-xs text-[#5a5043] mb-5">
          Modifiez votre nom de code ou votre adresse officielle.
        </p>

        <div
          v-if="profileError"
          role="alert"
          class="bg-[#fbeae8] border-l-4 border-stamp text-stamp-dark text-xs p-3 mb-4"
        >
          [!] {{ profileError }}
        </div>
        <div
          v-if="profileSuccess"
          role="status"
          class="bg-[#e8f5e9] border-l-4 border-green-700 text-green-800 text-xs p-3 mb-4"
        >
          [✓] {{ profileSuccess }}
        </div>

        <form @submit.prevent="updateProfile" class="flex flex-col gap-4">
          <BaseInput
            v-model="pseudo"
            type="text"
            name="pseudo"
            autocomplete="nickname"
            label="Pseudo / Nom de code"
            placeholder="Inspecteur Mika"
          />
          <BaseInput
            v-model="email"
            type="email"
            name="email"
            autocomplete="email"
            label="Courriel officiel"
            placeholder="agent@caseprompt.org"
            required
          />
          <BaseButton
            type="submit"
            :disabled="profileLoading"
            class="mt-2 self-start"
          >
            {{
              profileLoading ? 'Enregistrement...' : 'Mettre à jour la fiche'
            }}
          </BaseButton>
        </form>
      </PaperCard>

      <!-- Bloc 2 : Sécurité -->
      <PaperCard>
        <h2 class="text-lg text-noir mb-1">Sécurité & Accès</h2>
        <p class="text-xs text-[#5a5043] mb-5">
          Renouvelez votre code secret d'accès au poste.
        </p>

        <div
          v-if="passwordError"
          role="alert"
          class="bg-[#fbeae8] border-l-4 border-stamp text-stamp-dark text-xs p-3 mb-4"
        >
          [!] {{ passwordError }}
        </div>
        <div
          v-if="passwordSuccess"
          role="status"
          class="bg-[#e8f5e9] border-l-4 border-green-700 text-green-800 text-xs p-3 mb-4"
        >
          [✓] {{ passwordSuccess }}
        </div>

        <form @submit.prevent="updatePassword" class="flex flex-col gap-4">
          <BaseInput
            v-model="currentPassword"
            type="password"
            name="current-password"
            autocomplete="current-password"
            label="Code secret actuel"
            placeholder="••••••••••••"
            required
          />
          <BaseInput
            v-model="newPassword"
            type="password"
            name="new-password"
            autocomplete="new-password"
            minlength="8"
            label="Nouveau code secret"
            placeholder="8 caractères minimum"
            required
          />
          <BaseInput
            v-model="confirmPassword"
            type="password"
            name="confirm-new-password"
            autocomplete="new-password"
            label="Confirmer le nouveau code"
            placeholder="••••••••••••"
            required
          />
          <BaseButton
            type="submit"
            variant="danger"
            :disabled="passwordLoading"
            class="mt-2 self-start"
          >
            {{ passwordLoading ? 'Validation...' : 'Modifier le code secret' }}
          </BaseButton>
        </form>
      </PaperCard>
    </div>
  </main>
</template>
