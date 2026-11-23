<script setup lang="ts">
import { ref } from 'vue'

const plans = ref([
  {
    id: 'free',
    name: 'STAGIAIRE',
    price: '0 €',
    period: 'accès libre',
    stamp: 'GRATUIT',
    description: 'Pour découvrir la méthode Case Prompt et s\'initier au terrain.',
    features: [
      'Affaire N°001 : Mort au dernier étage',
      'Analyses d\'indices illimitées',
      'Accès au terminal de saisie de PV',
      'Support communautaire'
    ],
    buttonText: 'Ouvrir l\'affaire',
    highlight: false
  },
  {
    id: 'inspector',
    name: 'INSPECTEUR',
    price: '9 €',
    period: 'par mois',
    stamp: 'RECOMMANDÉ',
    description: 'Accès illimité aux nouvelles affaires criminelles chaque mois.',
    features: [
      'Toutes les affaires débloquées',
      '3 nouvelles enquêtes par mois',
      'Génération visuelle des scènes haute fidélité',
      'Interrogatoires de témoins poussés par IA',
      'Historique complet des procès-verbaux'
    ],
    buttonText: 'Souscrire l\'abonnement',
    highlight: true
  },
  {
    id: 'brigade',
    name: 'BRIGADE COMPLÈTE',
    price: '24 €',
    period: 'paiement unique',
    stamp: 'SANS ENGAGEMENT',
    description: 'Pack de 10 affaires complexes pour jouer en solo ou en équipe.',
    features: [
      '10 affaires d\'homicide exclusives',
      'Mode multijoueur (enquêter à plusieurs)',
      'Dossiers d\'indices téléchargeables en PDF',
      'Accès à vie sans abonnement'
    ],
    buttonText: 'Acquérir le pack',
    highlight: false
  }
])
</script>

<template>
  <main class="pricing-container">
    <div class="pricing-header">
      <p class="pricing-meta">TARIFICATION & BUDGET OPÉRATIONNEL</p>
      <h1 class="pricing-title">Financement de la Brigade</h1>
      <p class="pricing-subtitle">
        Sélectionnez votre accréditation pour débloquer les scellés et les dossiers d'homicides non résolus.
      </p>
    </div>

    <div class="cards-grid">
      <div 
        v-for="plan in plans" 
        :key="plan.id" 
        class="pricing-card"
        :class="{ 'card-highlight': plan.highlight }"
      >
        <div class="card-stamp">{{ plan.stamp }}</div>
        
        <div class="card-head">
          <h2 class="plan-name">{{ plan.name }}</h2>
          <div class="price-wrap">
            <span class="price">{{ plan.price }}</span>
            <span class="period">/ {{ plan.period }}</span>
          </div>
          <p class="plan-desc">{{ plan.description }}</p>
        </div>

        <hr class="divider" />

        <ul class="features-list">
          <li v-for="(feat, idx) in plan.features" :key="idx">
            <span class="check">—</span> {{ feat }}
          </li>
        </ul>

        <button class="btn-plan" :class="{ 'btn-highlight': plan.highlight }">
          {{ plan.buttonText }}
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.pricing-container {
  max-width: 1200px;
  width: 95%;
  margin: 30px auto 70px auto;
}

.pricing-header {
  text-align: center;
  margin-bottom: 50px;
}

.pricing-meta {
  font-size: 0.85rem;
  color: #dec594;
  letter-spacing: 1.5px;
  margin-bottom: 6px;
}

.pricing-title {
  color: #fff4db;
  font-size: 2.4rem;
  font-weight: normal;
  margin: 0 0 12px 0;
}

.pricing-subtitle {
  color: #cbb384;
  max-width: 580px;
  margin: 0 auto;
  font-size: 0.95rem;
  line-height: 1.5;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  align-items: stretch;
}

.pricing-card {
  background-color: #dec594;
  border-radius: 4px;
  padding: 34px 26px 28px 26px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.pricing-card.card-highlight {
  background-color: #f7e0b5;
  border: 2px solid #fff4db;
  transform: translateY(-8px);
}

.card-stamp {
  position: absolute;
  top: 18px;
  right: 18px;
  border: 1.5px solid #b93b2a;
  color: #b93b2a;
  padding: 3px 8px;
  font-size: 0.75rem;
  font-weight: bold;
  letter-spacing: 1px;
  transform: rotate(4deg);
}

.plan-name {
  font-size: 1.4rem;
  font-weight: normal;
  margin: 0 0 12px 0;
}

.price-wrap {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 12px;
}

.price {
  font-size: 2.2rem;
  font-weight: bold;
}

.period {
  font-size: 0.85rem;
  color: #4b4132;
}

.plan-desc {
  font-size: 0.85rem;
  color: #383127;
  line-height: 1.4;
  min-height: 48px;
}

.divider {
  border: none;
  border-top: 1px dashed #8b795e;
  margin: 20px 0;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0 0 28px 0;
  flex-grow: 1;
}

.features-list li {
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 12px;
  color: #221c17;
  display: flex;
  gap: 8px;
}

.btn-plan {
  background-color: #1a1613;
  color: #fff4db;
  border: none;
  padding: 12px;
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: opacity 0.2s;
}

.btn-plan:hover {
  opacity: 0.9;
}

.btn-highlight {
  background-color: #b93b2a;
  color: #ffffff;
}

.btn-highlight:hover {
  background-color: #9c2e20;
}

@media (max-width: 900px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
  .pricing-card.card-highlight {
    transform: none;
  }
}
</style>