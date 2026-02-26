<script setup>
const { app: { baseURL } } = useRuntimeConfig()
const { data: hero } = await useAsyncData('hero', () => 
  queryCollection('sections').where('stem', '=', 'sections/hero').first()
)
</script>

<template>
  <section class="hero" v-if="hero">
    <div class="container hero-grid">
      <div class="hero-content">
        <div class="badge">{{ hero.badge }}</div>
        <h1 class="hero-title" v-html="hero.title"></h1>
        <p class="hero-description">{{ hero.description }}</p>
        <div class="hero-actions">
          <a href="#" class="btn btn-primary">Découvrir evo360</a>
          <a href="#" class="btn btn-outline">Prendre rendez-vous</a>
        </div>

        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-num">15+</span>
            <span class="stat-label">Experts</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">360°</span>
            <span class="stat-label">Accompagnement</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">100%</span>
            <span class="stat-label">Personnalisé</span>
          </div>
        </div>
      </div>

      <div class="hero-visual">
        <div class="image-stack">
          <div class="img-wrapper img-1">
            <img :src="`${baseURL}${hero.img1.startsWith('/') ? hero.img1.substring(1) : hero.img1}`" alt="Visual 1" />
          </div>
          <div class="img-wrapper img-2">
            <img :src="`${baseURL}${hero.img2.startsWith('/') ? hero.img2.substring(1) : hero.img2}`" alt="Visual 2" />
          </div>
          <div class="img-wrapper img-3">
            <img :src="`${baseURL}${hero.img3.startsWith('/') ? hero.img3.substring(1) : hero.img3}`" alt="Visual 3" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero {
  padding-top: 10rem;
  padding-bottom: 6rem;
  background-image: radial-gradient(circle at 10% 20%, rgba(70, 34, 204, 0.03) 0%, transparent 40%),
                    radial-gradient(circle at 90% 80%, rgba(215, 241, 78, 0.05) 0%, transparent 40%);
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 4rem;
  align-items: center;
}

.badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(70, 34, 204, 0.08);
  color: var(--indigo);
  border-radius: var(--radius-full);
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1.5rem;
}

.hero-title {
  font-size: clamp(3rem, 6vw, 4.5rem);
  line-height: 1;
  margin-bottom: 1.5rem;

  :deep(.text-indigo) {
    color: var(--indigo);
    position: relative;
    display: inline-block;

    &::after {
      content: '';
      position: absolute;
      bottom: 0.1em;
      left: 0;
      width: 100%;
      height: 0.2em;
      background: var(--citron);
      z-index: -1;
      opacity: 0.5;
    }
  }
}

.hero-description {
  font-size: 1.125rem;
  color: var(--gray-600);
  max-width: 540px;
  margin-bottom: 2.5rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 4rem;
}

.hero-stats {
  display: flex;
  gap: 3rem;
  padding-top: 3rem;
  border-top: 1px solid var(--gray-200);
}

.stat-num {
  display: block;
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--gray-900);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--gray-400);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.hero-visual {
  position: relative;
  height: 500px;
}

.image-stack {
  position: relative;
  width: 100%;
  height: 100%;
}

.img-wrapper {
  position: absolute;
  overflow: hidden;
  box-shadow: var(--shadow-2xl);
  transition: var(--transition);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    z-index: 10 !important;
    transform: scale(1.05) translateY(-10px);
  }
}

.img-1 {
  top: 0;
  right: 0;
  width: 80%;
  height: 70%;
  border-radius: var(--radius-lg);
  z-index: 1;
}

.img-2 {
  bottom: 0;
  left: 0;
  width: 60%;
  height: 50%;
  border-radius: var(--radius-lg);
  border: 8px solid var(--white);
  z-index: 2;
}

.img-3 {
  top: 20%;
  left: -10%;
  width: 30%;
  height: 40%;
  border-radius: var(--radius-md);
  border: 6px solid var(--white);
  z-index: 3;
}

@media (max-width: 992px) {
  .hero-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .hero-description { margin-left: auto; margin-right: auto; }
  .hero-actions { justify-content: center; }
  .hero-stats { justify-content: center; }
  .hero-visual { height: 400px; margin-top: 4rem; }
  .img-3 { display: none; }
}
</style>
