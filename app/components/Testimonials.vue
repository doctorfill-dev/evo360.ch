<script setup>
const testimonials = [
  {
    name: 'Gaétan',
    age: '35 ans',
    initial: 'G',
    text: "« Je cherchais de l'énergie au quotidien, pas de la performance. Ici, j'ai appris à bouger sans avoir peur. »",
    color: 'var(--indigo)'
  },
  {
    name: 'Didier',
    age: '65 ans',
    initial: 'D',
    text: "« Je voulais agir préventivement, avant que la douleur ne s'installe. J'ai trouvé une approche qui me protège et me fait avancer. »",
    color: 'var(--citron)'
  },
  {
    name: 'Sophie',
    age: '52 ans',
    initial: 'S',
    text: "« Je suis venue pour arrêter d'avoir mal, pas pour devenir sportive. On m'a comprise et j'ai repris confiance petit à petit. »",
    color: 'var(--gray-400)'
  }
]
</script>

<template>
  <section id="testimonials" class="testimonials section-dark">
    <div class="container">
      <div class="testimonials-header">
        <h2 class="section-title">Ils nous font <span class="text-indigo">confiance</span></h2>
      </div>

      <div class="testimonials-grid">
        <div v-for="(item, index) in testimonials" :key="item.name"
             class="testimonial-card"
             :style="{ transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)` }">
          <div class="stars">★★★★★</div>
          <p class="quote">{{ item.text }}</p>
          <div class="author">
            <div class="avatar" :style="{ backgroundColor: item.color }">{{ item.initial }}</div>
            <div class="info">
              <div class="name">{{ item.name }}</div>
              <div class="meta">{{ item.age }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.testimonials {
  background-color: var(--dark);
  padding-bottom: 10rem;
}

.testimonials-header {
  text-align: center;
  margin-bottom: 5rem;

  .text-indigo {
    color: var(--indigo);
  }
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
}

.testimonial-card {
  background: rgba(255, 255, 255, 0.03);
  padding: 3rem;
  border-radius: var(--radius-xl);
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  transition: var(--transition);

  &:hover {
    transform: rotate(0) translateY(-10px) !important;
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--indigo);
  }

  &::before {
    content: '"';
    position: absolute;
    top: 1rem;
    right: 2rem;
    font-size: 5rem;
    font-family: var(--font-heading);
    color: var(--indigo);
    opacity: 0.2;
    line-height: 1;
  }
}

.stars {
  color: var(--citron);
  margin-bottom: 1.5rem;
  letter-spacing: 0.2em;
}

.quote {
  font-size: 1.125rem;
  color: var(--white);
  line-height: 1.6;
  font-style: italic;
  margin-bottom: 2.5rem;
  position: relative;
  z-index: 1;
}

.author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: var(--dark);
}

.name {
  font-weight: 700;
  color: var(--white);
}

.meta {
  font-size: 0.8125rem;
  color: var(--gray-400);
}
</style>
