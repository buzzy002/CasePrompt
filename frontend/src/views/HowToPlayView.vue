<script setup lang="ts">
import { ref } from 'vue'

const steps = ref([
  {
    num: '01',
    title: 'OBSERVER LA SCÈNE',
    stamp: 'ANALYSE',
    desc: 'Chaque enquête s\'ouvre sur un rapport visuel et textuel des lieux. Examinez attentivement la description de la pièce, les objets visibles et l\'état des accès.'
  },
  {
    num: '02',
    title: 'RÉDIGER VOS DÉCLARATIONS',
    stamp: 'PROMPT LIBRE',
    desc: 'Tapez vos actions à la première personne dans le champ du Procès-Verbal. Soyez précis et méthodique.',
    examples: [
      '— "J\'inspecte les tiroirs du bureau en bois"',
      '— "Je soulève le tapis sous la fenêtre"',
      '— "Je relève les empreintes sur le verre brisé"'
    ]
  },
  {
    num: '03',
    title: 'RÉCOLTER DES SCELLÉS',
    stamp: 'PIÈCES À CONVICTION',
    desc: 'Certaines actions fructueuses vous permettront de mettre la main sur des indices capitaux (clés, armes, notes manuscrites) qui s\'ajouteront à votre inventaire de scellés.'
  },
  {
    num: '04',
    title: 'RÉSOUDRE L\'AFFAIRE',
    stamp: 'VERDICT',
    desc: 'Une fois tous les éléments probants rassemblés, basculez sur l\'onglet "Résolution" pour désigner le coupable, le mobile et le mode opératoire devant le procureur.'
  }
])
</script>

<template>
  <main class="manual-container">
    <div class="manual-booklet">
      <div class="paperclip"></div>

      <!-- En-tête du manuel -->
      <div class="manual-header">
        <div class="header-meta">
          <span>MANUEL MÉTHODOLOGIQUE // DÉPARTEMENT 001</span>
          <span>CIRCULAIRE INTERNE — CONFIDENTIEL</span>
        </div>
        <div class="stamp-protocol">PROTOCOLE D'ENQUÊTE</div>
      </div>

      <h1 class="manual-title">GUIDE DE L'ENQUÊTEUR</h1>
      <p class="manual-intro">
        Case Prompt repose sur une mécanique d'investigation par invite textuelle (prompting). Le maître du jeu (l'IA) juge la pertinence de chaque décision et rédige le procès-verbal en temps réel.
      </p>

      <hr class="divider" />

      <!-- Grille des étapes -->
      <div class="steps-list">
        <article 
          v-for="step in steps" 
          :key="step.num" 
          class="step-card"
        >
          <div class="step-top">
            <span class="step-number">{{ step.num }}</span>
            <span class="step-stamp">{{ step.stamp }}</span>
          </div>

          <h2 class="step-title">{{ step.title }}</h2>
          <p class="step-desc">{{ step.desc }}</p>

          <div v-if="step.examples" class="examples-box">
            <span class="examples-title">Exemples de prompts valides :</span>
            <ul>
              <li v-for="(ex, i) in step.examples" :key="i">{{ ex }}</li>
            </ul>
          </div>
        </article>
      </div>

      <!-- Note de service en bas de page -->
      <aside class="service-memo">
        <div class="memo-badge">AVIS DE LA HIÉRARCHIE</div>
        <p>
          <strong>Attention aux actions impulsives :</strong> Défoncer une porte sans clé ou manipuler une arme sans gants peut altérer la scène de crime ou blesser votre personnage, réduisant vos options pour clore le dossier.
        </p>
      </aside>

      <!-- Pied d'appel à l'action -->
      <div class="manual-footer">
        <router-link to="/enquetes" class="btn-start">
          Rejoindre l'Affaire N°001
        </router-link>
      </div>
    </div>
  </main>
</template>

<style scoped>
.manual-container {
  max-width: 1100px;
  width: 95%;
  margin: 20px auto 70px auto;
  font-family: 'Courier Prime', Courier, monospace;
}

.manual-booklet {
  background-color: #fcfcfc;
  padding: 44px 48px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
  border-radius: 4px;
  position: relative;
  border: 1px solid #ddd5c5;
  color: #141414;
}

.paperclip {
  position: absolute;
  top: -18px;
  left: 48px;
  width: 16px;
  height: 52px;
  border: 2.5px solid #757b85;
  border-radius: 12px;
  background-color: transparent;
  box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.25);
  z-index: 10;
}

.manual-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.header-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 0.8rem;
  color: #635747;
  letter-spacing: 0.5px;
}

.stamp-protocol {
  border: 2px solid #b93b2a;
  color: #b93b2a;
  padding: 4px 12px;
  font-size: 0.85rem;
  font-weight: bold;
  letter-spacing: 1.5px;
  transform: rotate(-2deg);
}

.manual-title {
  font-size: 2.2rem;
  font-weight: normal;
  letter-spacing: -0.5px;
  margin: 0 0 10px 0;
}

.manual-intro {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #3b332a;
  max-width: 850px;
  margin: 0;
}

.divider {
  border: none;
  border-top: 1.5px dashed #8b795e;
  margin: 28px 0;
}

.steps-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
  margin-bottom: 36px;
}

.step-card {
  background-color: #f7f5ed;
  border: 1px solid #e2dac9;
  border-radius: 4px;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.step-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.step-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #dec594;
  background-color: #1a1613;
  padding: 2px 8px;
  border-radius: 2px;
}

.step-stamp {
  font-size: 0.75rem;
  color: #b93b2a;
  border: 1px solid #b93b2a;
  padding: 2px 6px;
  font-weight: bold;
  letter-spacing: 1px;
}

.step-title {
  font-size: 1.15rem;
  margin: 0 0 10px 0;
  font-weight: normal;
}

.step-desc {
  font-size: 0.88rem;
  line-height: 1.55;
  color: #332d27;
  margin: 0;
}

.examples-box {
  margin-top: 14px;
  background-color: #ece7da;
  padding: 12px 14px;
  border-radius: 2px;
}

.examples-title {
  font-size: 0.75rem;
  font-weight: bold;
  display: block;
  margin-bottom: 6px;
  color: #4b4132;
}

.examples-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.examples-box li {
  font-size: 0.8rem;
  line-height: 1.5;
  color: #1a1613;
}

.service-memo {
  background-color: #fbeae8;
  border-left: 4px solid #b93b2a;
  padding: 16px 20px;
  margin-bottom: 36px;
}

.memo-badge {
  font-size: 0.75rem;
  font-weight: bold;
  color: #b93b2a;
  letter-spacing: 1px;
  margin-bottom: 6px;
}

.service-memo p {
  font-size: 0.85rem;
  line-height: 1.5;
  color: #2b1f1d;
  margin: 0;
}

.manual-footer {
  display: flex;
  justify-content: center;
}

.btn-start {
  background-color: #1a1613;
  color: #fff4db;
  text-decoration: none;
  padding: 14px 28px;
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 0.5px;
  transition: background-color 0.15s;
}

.btn-start:hover {
  background-color: #38312b;
}

@media (max-width: 800px) {
  .steps-list {
    grid-template-columns: 1fr;
  }
  .manual-booklet {
    padding: 30px 20px;
  }
}
</style>