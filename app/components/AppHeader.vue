<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const { app: { baseURL } } = useRuntimeConfig()

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header :class="['header', { 'is-scrolled': isScrolled }]">
    <div class="container header-inner">
      <NuxtLink to="/" class="logo">
        <img :src="`${baseURL}img/logo.svg`" alt="evo360 logo" class="logo-img" />
      </NuxtLink>

      <nav class="nav">
        <ul class="nav-list">
          <li><NuxtLink to="#about" class="nav-link">Notre approche</NuxtLink></li>
          <li><NuxtLink to="#services" class="nav-link">Services</NuxtLink></li>
          <li><NuxtLink to="#testimonials" class="nav-link">Témoignages</NuxtLink></li>
          <li><NuxtLink to="#contact" class="nav-link">Contact</NuxtLink></li>
        </ul>
      </nav>

      <div class="actions">
        <a href="#" class="btn btn-primary btn-sm">Prendre rendez-vous</a>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 1.5rem 0;
  transition: var(--transition);

  &.is-scrolled {
    padding: 1rem 0;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    box-shadow: var(--shadow-md);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-img {
  height: 32px;
  width: auto;
}

.nav-list {
  display: flex;
  gap: 2rem;
}

.nav-link {
  font-weight: 500;
  font-size: 0.9375rem;
  color: var(--gray-600);

  &:hover {
    color: var(--indigo);
  }
}

.btn-sm {
  padding: 0.5rem 1.25rem;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .nav {
    display: none;
  }
}
</style>
