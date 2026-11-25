<script setup lang="ts">
import { useRouter } from 'vue-router'
import PaperCard from '../components/common/PaperCard.vue'
import BaseButton from '../components/common/BaseButton.vue'

const router = useRouter()
</script>

<template>
  <main class="flex-1 flex items-center justify-center p-6 bg-noir font-mono">
    <div class="w-full max-w-md">
      <PaperCard>
        <div class="flex justify-between items-start mb-6">
          <div>
            <p class="text-xs tracking-widest text-[#635747]">ARCHIVES DU CENTRAL</p>
            <p class="text-xs text-[#8a7a67]">AVIS DE RECHERCHE</p>
          </div>
          <div class="border-2 border-stamp text-stamp text-xs px-2 py-0.5 font-bold tracking-wider rotate-3">
            NON RÉPERTORIÉ
          </div>
        </div>

        <h1 class="text-4xl text-noir font-bold mb-2 tracking-tight">
          404
        </h1>
        <h2 class="text-base text-noir mb-4 font-normal">
          Dossier introuvable ou classé secret défense
        </h2>
        
        <p class="text-xs text-[#5a5043] leading-relaxed mb-6">
          La pièce demandée ne figure dans aucun casier de la brigade. Elle a pu être détruite, déplacée ou n'a jamais existé.
        </p>

        <div class="flex justify-center">
          <BaseButton @click="router.push('/enquetes')" variant="primary" class="w-full">
            Retourner aux affaires en cours
          </BaseButton>
        </div>
      </PaperCard>
    </div>
  </main>
</template>