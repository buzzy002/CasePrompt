<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { isAxiosError } from 'axios';
import apiClient from '../services/api';
import PaperCard from '../components/common/PaperCard.vue';
import BaseButton from '../components/common/BaseButton.vue';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const success = ref(false);
const errorMessage = ref('');

onMounted(async () => {
  const token = route.query.token as string;

  // Retire le token de l'URL et de l'historique du navigateur
  router.replace({ query: {} });

  if (!token) {
    loading.value = false;
    errorMessage.value = 'Jeton de validation manquant dans les réquisitions.';
    return;
  }

  try {
    await apiClient.get('/auth/verify-email', { params: { token } });
    success.value = true;
  } catch (err: unknown) {
    const message = isAxiosError(err) ? err.response?.data?.message : undefined;
    errorMessage.value =
      (Array.isArray(message) ? message.join(' ') : message) ||
      "Ce mandat d'activation est périmé ou non valide.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <main class="flex-1 flex items-center justify-center p-6 bg-noir font-mono">
    <div class="w-full max-w-md">
      <PaperCard>
        <div class="text-center mb-6">
          <p class="text-xs tracking-widest text-[#635747] mb-1">
            SERVICE DU PERSONNEL
          </p>
          <h1 class="text-xl text-noir">Validation du Matricule</h1>
        </div>

        <div v-if="loading" class="text-center py-6 text-sm text-[#4a4034]">
          <p>Examen des pièces d'identification en cours...</p>
        </div>

        <div v-else-if="success" class="text-center py-4">
          <div
            class="border-2 border-green-700 text-green-700 text-sm font-bold inline-block px-3 py-1 mb-4 -rotate-1"
          >
            [ HABILITATION ACCORDÉE ]
          </div>
          <p class="text-xs text-[#2b251d] mb-6">
            Votre adresse a été authentifiée auprès de la préfecture. Votre
            poste est prêt.
          </p>
          <BaseButton
            @click="router.push('/connexion')"
            variant="primary"
            class="w-full"
          >
            Rejoindre le poste d'enquête
          </BaseButton>
        </div>

        <div v-else class="text-center py-4">
          <div
            class="border-2 border-stamp text-stamp text-sm font-bold inline-block px-3 py-1 mb-4 rotate-1"
          >
            [ VALIDATION ÉCHOUÉE ]
          </div>
          <p class="text-xs text-stamp mb-6">
            {{ errorMessage }}
          </p>
          <BaseButton
            @click="router.push('/inscription')"
            variant="kraft"
            class="w-full"
          >
            Refaire une demande d'inscription
          </BaseButton>
        </div>
      </PaperCard>
    </div>
  </main>
</template>
