<script setup>
const { app: { baseURL } } = useRuntimeConfig()
const { data: about } = await useAsyncData('about', () => 
  queryCollection('sections').where('stem', '=', 'sections/about').first()
)
</script>

<template>
  <section id="about" class="about" v-if="about">
    <div class="container about-grid">
      <div class="about-image">
        <div class="main-img-wrap">
          <img :src="`${baseURL}${about.image.startsWith('/') ? about.image.substring(1) : about.image}`" alt="Notre équipe" class="main-img" />
          <div class="experience-badge">
            <span class="number">10+</span>
            <span class="text">Années d'expertise</span>
          </div>
        </div>
      </div>

      <div class="about-content">
        <h2 class="section-title" v-html="about.title"></h2>
        <p class="lead">{{ about.lead }}</p>
        
        <div class="about-description">
          <p>{{ about.body_text }}</p>
        </div>

        <div class="quote-card">
          <p>« {{ about.quote }} »</p>
        </div>

        <div class="features-grid">
          <div class="feature">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.46 3 3.21 3 5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </div>
            <div>
              <h3>Écoute</h3>
              <p>Chaque parcours part de votre histoire</p>
            </div>
          </div>
          <div class="feature">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <h3>Accompagnement</h3>
              <p>Un suivi à chaque étape</p>
            </div>
          </div>
          <div class="feature">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <div>
              <h3>Respect</h3>
              <p>Vos limites sont notre boussole</p>
            </div>
          </div>
          <div class="feature">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <div>
              <h3>Durabilité</h3>
              <p>Des résultats dans le temps</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.about {
  background: var(--white);
  padding: 8rem 0;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6rem;
  align-items: center;
}

.about-image {
  position: relative;
}

.main-img-wrap {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-2xl);
}

.main-img {
  width: 100%;
  aspect-ratio: 4/5;
  object-fit: cover;
}

.experience-badge {
  position: absolute;
  bottom: 2rem;
  right: -2rem;
  background: var(--citron);
  padding: 1.5rem 2rem;
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: var(--shadow-xl);
  z-index: 2;

  .number {
    font-family: var(--font-heading);
    font-size: 2.5rem;
    font-weight: 900;
    color: var(--dark);
    line-height: 1;
  }

  .text {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--dark);
    text-align: center;
    margin-top: 0.25rem;
    white-space: nowrap;
  }
}

.section-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  margin-bottom: 2rem;
  
  :deep(.accent) {
    color: var(--indigo);
  }
}

.lead {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.about-description {
  color: var(--gray-600);
  margin-bottom: 2rem;

  :deep(p) {
    margin-bottom: 1rem;
    &:last-child { margin-bottom: 0; }
  }
}

.quote-card {
  margin: 2.5rem 0;
  padding: 2rem;
  background: var(--gray-100);
  border-left: 6px solid var(--indigo);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;

  p {
    font-style: italic;
    font-size: 1.125rem;
    color: var(--indigo);
    margin: 0;
    font-weight: 500;
    line-height: 1.6;
  }
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 3rem;
}

.feature {
  display: flex;
  gap: 1.25rem;

  h3 {
    font-size: 1.125rem;
    margin-bottom: 0.25rem;
    font-weight: 700;
  }

  p {
    font-size: 0.875rem;
    margin: 0;
    color: var(--gray-600);
  }
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: rgba(70, 34, 204, 0.1);
  color: var(--indigo);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

@media (max-width: 992px) {
  .about-grid { grid-template-columns: 1fr; gap: 4rem; }
  .experience-badge { right: 2rem; }
}
</style>
