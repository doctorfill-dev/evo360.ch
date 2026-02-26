<template>
  <section class="cta">
    <div class="container">
      <div class="cta-card">
        <div class="cta-content">
          <h2 class="cta-title">Prêt à reprendre le <span class="text-white">contrôle</span> de votre santé ?</h2>
          <p class="cta-text">Prenez rendez-vous pour un premier échange et découvrez comment evo360 peut vous accompagner.</p>
          <div class="cta-actions">
            <a href="#" class="btn btn-primary">Prendre rendez-vous →</a>
            <a href="tel:0765070360" class="btn btn-outline-white">076 507 03 60</a>
          </div>
        </div>
        <div class="cta-visual">
          <!-- Geometric elements for depth -->
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.cta {
  background: var(--cream);
  padding: 6rem 0;
}

.cta-card {
  background: var(--citron);
  border-radius: var(--radius-xl);
  padding: 5rem;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-2xl);
}

.cta-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: var(--dark);
  margin-bottom: 1.5rem;

  .text-white {
    color: var(--white);
    text-shadow: 2px 2px 0 var(--indigo);
  }
}

.cta-text {
  font-size: 1.25rem;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 2.5rem;
  max-width: 600px;
}

.cta-actions {
  display: flex;
  gap: 1rem;
}

.btn-outline-white {
  background: transparent;
  border: 2px solid var(--white);
  color: var(--white);

  &:hover {
    background: var(--white);
    color: var(--dark);
  }
}

.cta-visual {
  position: relative;
  height: 100%;
}

.shape {
  position: absolute;
  background: var(--indigo);
  border-radius: var(--radius-lg);
  opacity: 0.1;
}

.shape-1 {
  width: 200px;
  height: 200px;
  top: -50px;
  right: -50px;
  transform: rotate(15deg);
}

.shape-2 {
  width: 100px;
  height: 100px;
  bottom: -20px;
  left: 20px;
  transform: rotate(-10deg);
  background: var(--white);
}

@media (max-width: 992px) {
  .cta-card {
    grid-template-columns: 1fr;
    padding: 3rem;
    text-align: center;
  }

  .cta-actions {
    justify-content: center;
  }

  .cta-visual {
    display: none;
  }
}
</style>
