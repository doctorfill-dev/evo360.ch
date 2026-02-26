<script setup>
const services = [
  {
    id: '01',
    title: 'Check-Up 360',
    description: "Bilan complet pour comprendre votre corps et définir un plan d'action personnalisé.",
    image: '/img/bilans.jpg'
  },
  {
    id: '02',
    title: 'Coaching personnalisé',
    description: 'Accompagnement sur mesure en mouvement et préparation physique.',
    image: '/img/prepa.jpg'
  },
  {
    id: '03',
    title: 'Fitness',
    description: 'Abonnements flexibles pour un entraînement guidé dans un espace dédié.',
    image: '/img/fitness.jpg'
  },
  {
    id: '04',
    title: 'Photobiomodulation',
    description: 'Thérapie par lumière rouge : ~15 minutes pour la récupération et le bien-être.',
    image: '/img/redlight.jpg'
  },
  {
    id: '05',
    title: 'Entreprises & Institutions',
    description: 'Programmes santé et performance adaptés à votre organisation.',
    image: '/img/neurotracker.jpg'
  },
  {
    id: '06',
    title: 'Prévention active',
    description: "Agir avant que la douleur ne s'installe — protéger et avancer.",
    image: '/img/cerveau.jpg'
  }
]
</script>

<template>
  <section id="services" class="services section-dark">
    <div class="container">
      <div class="services-header">
        <h2 class="section-title">
          Avec vous. Pour vous.<br />
          <span class="accent-citron">À chaque étape.</span>
        </h2>
        <p class="section-desc">
          Chaque parcours est pensé pour vous, selon votre histoire, vos besoins et vos envies. Une expertise variée pour une approche globale.
        </p>
      </div>

      <div class="services-grid">
        <div v-for="service in services" :key="service.id" class="service-card">
          <div class="card-image">
            <img :src="service.image" :alt="service.title" />
            <div class="card-id">{{ service.id }}</div>
          </div>
          <div class="card-content">
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
            <a href="#" class="card-link">En savoir plus →</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.services {
  background-color: var(--dark);
  padding-top: 10rem;
}

.services-header {
  margin-bottom: 5rem;
  max-width: 800px;
}

.section-desc {
  color: var(--gray-400);
  font-size: 1.125rem;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
}

.service-card {
  background: var(--dark-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: var(--transition);
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-10px);
    border-color: var(--indigo);
    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);

    .card-image img {
      transform: scale(1.1);
    }
  }
}

.card-image {
  position: relative;
  height: 240px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: var(--transition);
    filter: grayscale(20%) brightness(0.8);
  }

  .card-id {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    background: var(--indigo);
    color: var(--white);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 0.875rem;
    box-shadow: var(--shadow-md);
  }
}

.card-content {
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--white);
  }

  p {
    color: var(--gray-400);
    font-size: 0.9375rem;
    margin-bottom: 2rem;
    line-height: 1.6;
    flex: 1;
  }
}

.card-link {
  color: var(--citron);
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &:hover {
    color: var(--white);
  }
}

@media (max-width: 768px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
}
</style>
