// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.scss'],
  ssr: true,
  app: {
    // Si perso, laissez '/'
    // Si c'est GH Pages (cutiips.github.io/repo), mettez '/evo360.ch/'
    baseURL: process.env.NODE_ENV === 'production' ? '/' : '/evo360.ch/',
    head: {
      title: 'evo360 — Centre de performance & bien-être',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Votre santé mérite une approche à 360°. Centre de performance & bien-être à Neuchâtel.' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@700;800;900&display=swap' }
      ]
    }
  },
  nitro: {
    preset: 'github-pages'
  }
})
