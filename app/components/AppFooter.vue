<script setup>
const { app: { baseURL } } = useRuntimeConfig()
</script>

<template>
  <footer class="footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <img :src="`${baseURL}img/logo.svg`" alt="evo360 logo" class="footer-logo" />
        <p class="footer-desc">
          Un accompagnement personnalisé avec les meilleurs experts en mouvement, préparation physique et santé à Neuchâtel.
        </p>
      </div>

              <div class="footer-links">
                <h3 class="footer-title">Navigation</h3>
                <ul>
                  <li><NuxtLink to="#about">Notre approche</NuxtLink></li>
                  <li><NuxtLink to="#services">Services</NuxtLink></li>
                  <li><NuxtLink to="#testimonials">Témoignages</NuxtLink></li>
                  <li><NuxtLink to="#contact">Contact</NuxtLink></li>
                </ul>
              </div>
      
              <div class="footer-links">
                <h3 class="footer-title">Suivez-nous</h3>
                <ul>
                  <li><a href="#">Instagram</a></li>
                  <li><a href="#">LinkedIn</a></li>
                  <li><a href="#">Facebook</a></li>
                </ul>
              </div>
            </div>
      <div class="footer-bottom">
        <div class="container">
          <div class="bottom-inner">
            <p>&copy; {{ new Date().getFullYear() }} evo360. Tous droits réservés.</p>
            <div class="legal">
              <a href="#">Mentions légales</a>
              <a href="#">Politique de confidentialité</a>
            </div>
          </div>
        </div>
      </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  background: var(--white);
  padding: 6rem 0 2rem;
  border-top: 1px solid var(--gray-100);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 4rem;
  margin-bottom: 4rem;
}

.footer-logo {
  height: 32px;
  margin-bottom: 1.5rem;
}

.footer-desc {
  color: var(--gray-600);
  font-size: 0.9375rem;
  max-width: 320px;
}

.footer-title {
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
  color: var(--dark);
}

ul {
  padding: 0;
  margin: 0;
  list-style: none;

  li {
    margin-bottom: 0.75rem;
    font-size: 0.9375rem;
    color: var(--gray-600);

    a:hover {
      color: var(--indigo);
    }

    strong {
      color: var(--dark);
      display: block;
      margin-bottom: 0.25rem;
    }
  }
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid var(--gray-100);

  .bottom-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8125rem;
    color: var(--gray-400);
  }

  .legal {
    display: flex;
    gap: 2rem;

    a:hover {
      color: var(--gray-900);
    }
  }
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .bottom-inner {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
