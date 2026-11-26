<script setup lang="ts">
import PaperCard from '../components/common/PaperCard.vue';
import BaseButton from '../components/common/BaseButton.vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

interface Plan {
  name: string;
  price: string;
  period: string | null;
  badge: string;
  features: string[];
  actionText: string;
  isPopular: boolean;
  available: boolean;
}

const router = useRouter();
const authStore = useAuthStore();

const plans: Plan[] = [
  {
    name: 'Adjoint',
    price: '0 €',
    period: null,
    badge: 'ACCÈS LIBRE',
    features: [
      '1 affaire complète (Mort au dernier étage)',
      'Accès au Procès-Verbal interactif',
      'Résolution et arbitrage de base',
    ],
    actionText: "Commencer l'enquête",
    isPopular: false,
    available: true,
  },
  {
    name: 'Inspecteur Titulaire',
    price: '9,99 €',
    period: '/ mois',
    badge: 'HABILITATION BRIGADE',
    features: [
      'Toutes les affaires en cours et à venir',
      'Analyses balistiques et toxicologiques avancées',
      'Mode multijoueur (enquêtes en brigade)',
      "Génération d'images de scènes en haute définition",
    ],
    actionText: 'Bientôt disponible',
    isPopular: true,
    // Passe à true quand le paiement existera
    available: false,
  },
];

function choosePlan(plan: Plan) {
  if (!plan.available) return;
  // Visiteur non connecté
  router.push(authStore.isAuthenticated ? '/enquetes' : '/inscription');
}
</script>

<template>
  <main class="w-[95%] max-w-[1000px] mx-auto my-8 font-mono">
    <div class="text-center mb-8">
      <p class="text-xs tracking-widest text-kraft mb-1">
        RÉGIE DES COMPTES CRIMINELS
      </p>
      <h1 class="text-3xl text-cream font-normal">Grille des Habilitations</h1>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div v-for="plan in plans" :key="plan.name" class="relative">
        <PaperCard>
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-xl font-bold text-noir">{{ plan.name }}</h2>
            <span
              class="text-[10px] font-bold px-2 py-0.5 border"
              :class="
                plan.isPopular
                  ? 'border-stamp-dark text-stamp-dark rotate-2'
                  : 'border-noir text-noir'
              "
            >
              {{ plan.badge }}
            </span>
          </div>

          <div class="text-3xl font-bold text-noir mb-6">
            {{ plan.price }}
            <span
              v-if="plan.period"
              class="text-xs font-normal text-[#635747]"
              >{{ plan.period }}</span
            >
          </div>

          <ul
            class="flex flex-col gap-3 text-xs text-[#332d27] mb-8 min-h-[120px]"
          >
            <li
              v-for="(feat, idx) in plan.features"
              :key="idx"
              class="flex items-start gap-2"
            >
              <span class="text-stamp-dark font-bold" aria-hidden="true"
                >✓</span
              >
              <span>{{ feat }}</span>
            </li>
          </ul>

          <div class="flex justify-center">
            <BaseButton
              :disabled="!plan.available"
              :variant="plan.isPopular ? 'danger' : 'primary'"
              class="w-full text-center"
              @click="choosePlan(plan)"
            >
              {{ plan.actionText }}
            </BaseButton>
          </div>
        </PaperCard>
      </div>
    </div>
  </main>
</template>
