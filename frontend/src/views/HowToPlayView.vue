<script setup lang="ts">
import PaperCard from '../components/common/PaperCard.vue';
import BaseButton from '../components/common/BaseButton.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <main class="w-[95%] max-w-[900px] mx-auto my-8 font-mono">
    <PaperCard>
      <div class="border-b-2 border-noir pb-4 mb-8 text-center">
        <p class="text-xs tracking-widest text-[#635747] mb-1">
          MANUEL DU DÉTECTIVE // RÈGLEMENT OFFICIEL
        </p>
        <h1 class="text-2xl sm:text-3xl font-normal text-noir">
          Protocole d'Investigation
        </h1>
      </div>

      <div class="flex flex-col gap-8 text-sm text-[#2b251d] leading-relaxed">
        <section class="border-l-2 border-noir pl-4">
          <h2 class="text-base font-bold text-noir mb-2">
            1. Observez la scène
          </h2>
          <p>
            Chaque dossier présente un état initial des lieux. Lisez
            attentivement la description de la pièce, les objets visibles et
            l'heure des événements.
          </p>
        </section>

        <section class="border-l-2 border-noir pl-4">
          <h2 class="text-base font-bold text-noir mb-2">
            2. Rédigez vos déclarations
          </h2>
          <p>
            Utilisez le champ sous le procès-verbal pour indiquer vos gestes en
            langage naturel (ex. <em>« Je fouille le tiroir »</em>,
            <em>« J'examine le coffre-fort »</em>). L'intelligence artificielle
            du central évalue la pertinence de votre action et retranscrit les
            faits constatés.
          </p>
        </section>

        <section class="border-l-2 border-noir pl-4">
          <h2 class="text-base font-bold text-noir mb-2">
            3. Récoltez les scellés
          </h2>
          <p>
            Toute pièce découverte lors d'une fouille s'ajoute immédiatement à
            votre registre de scellés. Gardez un œil sur les indices décisifs
            (armes, relevés bancaires, clés).
          </p>
        </section>

        <section class="border-l-2 border-stamp pl-4">
          <h2 class="text-base font-bold text-stamp mb-2">
            4. Déposez vos conclusions (Résolution)
          </h2>
          <p>
            Lorsque vous estimez détenir assez d'éléments, basculez sur l'onglet
            <strong>Résolution</strong>. Désignez formellement le suspect,
            l'arme et formulez votre mobile pour soumettre le dossier au
            Parquet.
          </p>
        </section>
      </div>

      <div class="mt-10 flex justify-center">
        <BaseButton
          @click="router.push('/enquetes')"
          variant="primary"
          class="py-3 px-8"
        >
          Ouvrir le premier dossier
        </BaseButton>
      </div>
    </PaperCard>
  </main>
</template>
