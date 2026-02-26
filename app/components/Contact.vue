<script setup>
const { data: contact } = await useAsyncData('contact', () => 
  queryCollection('sections').where('stem', '=', 'sections/contact').first()
)
</script>

<template>
  <section id="contact" class="contact" v-if="contact">
    <div class="container">
      <div class="contact-header">
        <h2 class="section-title" v-html="contact.title"></h2>
        <p class="section-desc">{{ contact.description }}</p>
      </div>

      <div class="contact-grid">
        <div class="contact-card card-depth">
          <div class="icon-wrap ci-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <h3>Adresse</h3>
          <p v-html="contact.address.replace(/\n/g, '<br>')"></p>
        </div>

        <div class="contact-card card-depth">
          <div class="icon-wrap ci-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <h3>Téléphone</h3>
          <p><a :href="`tel:${contact.phone.replace(/\s/g, '')}`">{{ contact.phone }}</a></p>
        </div>

        <div class="contact-card card-depth">
          <div class="icon-wrap ci-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </div>
          <h3>Email</h3>
          <p><a :href="`mailto:${contact.email}`">{{ contact.email }}</a></p>
        </div>

        <div class="contact-card card-depth">
          <div class="icon-wrap ci-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-car"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
          </div>
          <h3>Accès</h3>
          <p v-html="contact.access.replace(/\n/g, '<br>')"></p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.contact {
  background: var(--cream);
  padding: 8rem 0;
}

.contact-header {
  text-align: center;
  margin-bottom: 5rem;

  .section-desc {
    max-width: 600px;
    margin: 1rem auto 0;
    color: var(--gray-600);
  }
}

.section-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  margin-bottom: 1.5rem;
  
  :deep(.accent) {
    color: var(--indigo);
  }
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.contact-card {
  padding: 3rem 2rem;
  text-align: center;
  background: var(--white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-100);
  box-shadow: var(--shadow-xl);
  transition: var(--transition);

  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-2xl);
  }

  h3 {
    margin-bottom: 1rem;
    font-size: 1.25rem;
    font-weight: 700;
  }

  p {
    color: var(--gray-600);
    font-size: 0.9375rem;
    line-height: 1.6;

    a:hover {
      color: var(--indigo);
    }
  }
}

.icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-md);
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);

  svg {
    width: 28px;
    height: 28px;
  }

  &.ci-1 { background: var(--indigo); box-shadow: 0 10px 20px -5px rgba(70, 34, 204, 0.4); }
  &.ci-2 { background: var(--indigo-soft); box-shadow: 0 10px 20px -5px rgba(99, 68, 212, 0.4); }
  &.ci-3 { background: var(--dark); box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.2); }
  &.ci-4 { background: var(--citron-dark); color: var(--dark); box-shadow: 0 10px 20px -5px rgba(184, 204, 66, 0.4); }
}
</style>
