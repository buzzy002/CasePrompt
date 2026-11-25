<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { sendDetectiveAction } from '../services/api'
import BaseButton from '../components/common/BaseButton.vue'
import PaperCard from '../components/common/PaperCard.vue'

interface PvEntry {
  id: number
  playerAction: string
  iaNarrative: string
  lootFound?: string
}

interface VerdictResult {
  isSolved: boolean
  title: string
  details: string
}

// Gestion des onglets
const activeTab = ref<'investigation' | 'resolution'>('investigation')

// État de l'enquête & saisie
const declaration = ref('')
const isLoading = ref(false)
const pvScrollContainer = ref<HTMLElement | null>(null)

// Pièces à conviction / Scellés
const scelles = ref([
  { id: 1, label: 'Clé en laiton', checked: false },
  { id: 2, label: 'Couteau', checked: false }
])

// Suspects identifiés dans l'affaire N°001
const suspects = ref([
  { id: 'adjointe', name: 'Claire Delmas (Directrice adjointe)', motive: 'Accès aux comptes occultes de la holding' },
  { id: 'vigile', name: 'Marc Vasseur (Chef de la sécurité)', motive: 'Présent sur la passerelle au moment de la panne' },
  { id: 'rival', name: 'Julien Meyer (Associé évincé)', motive: 'Menacé de faillite par la victime' }
])

// Formulaire d'accusation
const accusation = ref({
  suspectId: '',
  weapon: '',
  motiveSummary: ''
})

// Résultat du verdict
const verdict = ref<VerdictResult | null>(null)
const isSubmittingVerdict = ref(false)

// Historique dynamique du procès-verbal
const history = ref<PvEntry[]>([
  {
    id: 1,
    playerAction: 'je fouille le tiroir du bureau.',
    iaNarrative: 'Le tiroir glisse sans résistance. Sous une pile de factures, quelque chose brille.',
    lootFound: 'Saisi : une clé en laiton et un couteau.'
  },
  {
    id: 2,
    playerAction: 'je défonce la porte des archives d\'un coup de pied.',
    iaNarrative: 'Vous prenez votre élan... mais votre cheville vous lâche avant l\'impact. La porte n\'a même pas tremblé.'
  }
])

// Auto-scroll du PV dès que l'historique grandit
watch(history, async () => {
  await nextTick()
  if (pvScrollContainer.value) {
    pvScrollContainer.value.scrollTop = pvScrollContainer.value.scrollHeight
  }
}, { deep: true })

// Formatage de la date du jour
const formattedDate = computed(() => {
  return new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

// Envoi d'une déclaration d'action
async function submitDeclaration() {
  const actionText = declaration.value.trim()
  if (!actionText || isLoading.value) return

  declaration.value = ''
  isLoading.value = true

  try {
    const data = await sendDetectiveAction(actionText)
    history.value.push({
      id: Date.now(),
      playerAction: actionText,
      iaNarrative: data.narrative,
      lootFound: data.loot
    })
  } catch (err) {
    history.value.push({
      id: Date.now(),
      playerAction: actionText,
      iaNarrative: '[Liaison radio interrompue : impossible de joindre le central]'
    })
  } finally {
    isLoading.value = false
  }
}

// Soumission du réquisitoire au procureur
async function submitAccusation() {
  if (!accusation.value.suspectId || !accusation.value.weapon) return

  isSubmittingVerdict.value = true

  setTimeout(() => {
    isSubmittingVerdict.value = false
    
    // Scénario : Claire Delmas avec le Couteau
    if (accusation.value.suspectId === 'adjointe' && accusation.value.weapon === 'Couteau') {
      verdict.value = {
        isSolved: true,
        title: 'AFFAIRE RÉSOLUE',
        details: 'Vos preuves concordent parfaitement. Les empreintes sur le couteau et le relevé des appels accablent Claire Delmas. Le mandat de dépôt est signé.'
      }
    } else {
      verdict.value = {
        isSolved: false,
        title: 'CLASSÉ SANS SUITE / ERREUR JUDICIAIRE',
        details: 'Le juge d\'instruction rejette votre réquisitoire : faisceau de présomptions insuffisant ou pièce à conviction non concordante. Le suspect est relâché faute de preuves formelles.'
      }
    }
  }, 1000)
}

function reopenCase() {
  verdict.value = null
  activeTab.value = 'investigation'
}
</script>

<template>
  <main class="w-[95%] max-w-[1400px] mx-auto my-3 mb-10 relative font-mono">
    <!-- Onglets du dossier kraft -->
    <div class="flex gap-1">
      <button 
        type="button"
        class="border-none py-2 px-4 sm:px-6 text-sm cursor-pointer rounded-t-md transition-colors"
        :class="activeTab === 'investigation' ? 'bg-[#dec594] font-bold text-[#141414]' : 'bg-[#cbb384] text-[#2b251d] hover:bg-[#dec594]'"
        @click="activeTab = 'investigation'"
      >
        AFFAIRE N°001
      </button>
      <button 
        type="button"
        class="border-none py-2 px-4 sm:px-6 text-sm cursor-pointer rounded-t-md transition-colors"
        :class="activeTab === 'resolution' ? 'bg-[#dec594] font-bold text-[#141414]' : 'bg-[#cbb384] text-[#2b251d] hover:bg-[#dec594]'"
        @click="activeTab = 'resolution'"
      >
        Résolution
      </button>
    </div>

    <!-- CORPS DU DOSSIER KRAFT -->
    <div class="bg-[#dec594] rounded-tr-xl rounded-b-xl p-4 sm:p-7 lg:p-8 grid grid-cols-1 lg:grid-cols-[1fr_390px] gap-6 lg:gap-9 shadow-2xl relative lg:min-h-[640px]">

      <!-- ================= VUE 1 : ENQUÊTE EN COURS ================= -->
      <template v-if="activeTab === 'investigation'">
        <div class="flex flex-col">
          <div class="flex justify-between items-start mb-5">
            <div>
              <p class="text-sm text-[#4b4132] mb-1">Bureau du PDG · nuit du {{ formattedDate }}</p>
              <h1 class="text-3xl font-normal tracking-tight m-0">Mort au dernier étage</h1>
            </div>
            <div class="border-2 border-stamp text-stamp px-3.5 py-1.5 text-base font-bold rotate-3 tracking-widest rounded-sm">
              EN COURS
            </div>
          </div>

          <div class="bg-[#12100e] rounded min-h-[240px] sm:min-h-[480px] flex items-center justify-center p-6 sm:p-10 border-2 border-[#4a3e2e]">
            <div class="text-[#d1b88a] text-center max-w-[520px]">
              <p class="text-lg mb-3">[ Image de la scène ]</p>
              <p class="text-sm leading-relaxed opacity-90">
                Bureau du PDG : grand bureau en bois avec un tiroir, porte des archives au fond, fenêtre sur la ville la nuit.
              </p>
            </div>
          </div>

          <div class="mt-6">
            <h3 class="text-base font-normal mb-3">Scellés & Pièces saisies</h3>
            <div class="flex gap-3 flex-wrap">
              <label 
                v-for="item in scelles" 
                :key="item.id" 
                class="bg-white rounded-full py-1.5 px-4 flex items-center gap-2 text-xs font-bold cursor-pointer shadow-sm"
              >
                <input type="checkbox" v-model="item.checked" class="hidden" />
                <span 
                  class="w-3 h-3 border border-[#222] rounded-full inline-block"
                  :class="{ 'bg-[#222]': item.checked }"
                ></span>
                <span>{{ item.label }}</span>
              </label>

              <div class="border border-dashed border-[#73644f] rounded-full py-1.5 px-4 text-xs text-[#574b3a]">
                + Indices à découvrir
              </div>
            </div>
          </div>
        </div>

        <!-- Procès-Verbal -->
        <aside class="relative">
          <PaperCard class="h-full flex flex-col justify-between min-h-[420px] lg:min-h-[600px] lg:rotate-[0.8deg]">
            <h2 class="text-center text-lg tracking-widest my-2 mb-5">PROCÈS-VERBAL</h2>

            <div ref="pvScrollContainer" class="flex-grow text-xs leading-relaxed overflow-y-auto max-h-[360px] sm:max-h-[480px] scroll-smooth pr-1">
              <div v-for="entry in history" :key="entry.id" class="mb-5">
                <p><strong>— Vous :</strong> {{ entry.playerAction }}</p>
                <p class="my-2 text-[#333]">{{ entry.iaNarrative }}</p>
                <p v-if="entry.lootFound" class="text-stamp font-bold">{{ entry.lootFound }}</p>
              </div>

              <div v-if="isLoading" class="mb-5 italic text-[#666]">
                Enregistrement de la déposition...
              </div>

              <div class="inline-block border border-stamp text-stamp text-[10px] px-2 py-0.5 -rotate-6 tracking-wide mt-2">
                RÉDIGÉ PAR IA
              </div>
            </div>

            <div class="border-t border-dashed border-[#888] pt-3.5 mt-4">
              <label class="block text-xs font-bold mb-2">Déclaration suivante :</label>
              <div class="flex gap-2 items-end">
                <input
                  type="text"
                  v-model="declaration"
                  placeholder="J'examine l'armoire..."
                  :disabled="isLoading"
                  @keyup.enter="submitDeclaration"
                  class="flex-grow bg-transparent border-b-2 border-noir p-1.5 text-xs outline-none focus:border-stamp transition-colors"
                />
                <BaseButton 
                  :disabled="isLoading" 
                  @click="submitDeclaration"
                  class="text-xs py-1.5 px-3"
                >
                  {{ isLoading ? '...' : 'Signer' }}
                </BaseButton>
              </div>
            </div>
          </PaperCard>
        </aside>
      </template>

      <!-- ================= VUE 2 : RÉSOLUTION DU DOSSIER ================= -->
      <template v-else>
        <div class="col-span-full flex justify-center items-start py-2">
          <div class="w-full max-w-[800px]">
            <PaperCard>
              <!-- 2A : Formulaire -->
              <div v-if="!verdict">
                <div class="text-center mb-8 border-b-2 border-noir pb-4">
                  <p class="text-xs tracking-widest text-[#635747] mb-1">TRIBUNAL DE GRANDE INSTANCE // SECTION CRIMINELLE</p>
                  <h2 class="text-2xl tracking-wide mb-2">RÉQUISITOIRE DE CLÔTURE</h2>
                  <p class="text-xs text-[#4a4034]">Désignez le présumé coupable et formulez vos conclusions motivées.</p>
                </div>

                <form @submit.prevent="submitAccusation" class="flex flex-col gap-6">
                  <div class="flex flex-col gap-2">
                    <label class="text-xs font-bold">1. Suspect déféré devant la justice :</label>
                    <select 
                      v-model="accusation.suspectId" 
                      required
                      class="bg-[#f3eedf] border border-[#73644f] p-2.5 text-sm outline-none rounded-sm"
                    >
                      <option value="" disabled selected>Sélectionnez un suspect interrogé...</option>
                      <option v-for="s in suspects" :key="s.id" :value="s.id">
                        {{ s.name }} (Mobile : {{ s.motive }})
                      </option>
                    </select>
                  </div>

                  <div class="flex flex-col gap-2">
                    <label class="text-xs font-bold">2. Pièce à conviction décisive :</label>
                    <select 
                      v-model="accusation.weapon" 
                      required
                      class="bg-[#f3eedf] border border-[#73644f] p-2.5 text-sm outline-none rounded-sm"
                    >
                      <option value="" disabled selected>Associez un scellé découvert sur les lieux...</option>
                      <option v-for="item in scelles" :key="item.id" :value="item.label">
                        {{ item.label }}
                      </option>
                    </select>
                  </div>

                  <div class="flex flex-col gap-2">
                    <label class="text-xs font-bold">3. Synthèse des charges :</label>
                    <textarea 
                      v-model="accusation.motiveSummary" 
                      rows="4" 
                      placeholder="Expliquez comment le suspect a pu pénétrer dans le bureau et dissimuler son geste..."
                      required
                      class="bg-[#f3eedf] border border-[#73644f] p-2.5 text-sm outline-none rounded-sm resize-y"
                    ></textarea>
                  </div>

                  <div class="flex justify-center mt-3">
                    <BaseButton 
                      type="submit" 
                      variant="danger" 
                      :disabled="isSubmittingVerdict"
                      class="py-3 px-8 text-sm uppercase tracking-wider"
                    >
                      {{ isSubmittingVerdict ? 'Délibération du Procureur...' : 'Transmettre au Parquet' }}
                    </BaseButton>
                  </div>
                </form>
              </div>

              <!-- 2B : Affichage du Verdict -->
              <div v-else class="text-center py-6">
                <div 
                  class="inline-block py-2 px-6 text-xl font-bold tracking-widest mb-6"
                  :class="verdict.isSolved ? 'border-4 border-green-700 text-green-700 -rotate-2' : 'border-4 border-stamp text-stamp rotate-2'"
                >
                  {{ verdict.title }}
                </div>

                <h3 class="text-lg font-bold mb-3">
                  {{ verdict.isSolved ? 'Rapport d\'inculpation confirmé' : 'Classement sans suite prononcé' }}
                </h3>

                <p class="text-sm leading-relaxed text-[#332d27] max-w-[600px] mx-auto mb-8">
                  {{ verdict.details }}
                </p>

                <div>
                  <BaseButton @click="reopenCase" variant="primary">
                    {{ verdict.isSolved ? 'Réexaminer les archives' : 'Rouvrir l\'instruction' }}
                  </BaseButton>
                </div>
              </div>
            </PaperCard>
          </div>
        </div>
      </template>

    </div>
  </main>
</template>