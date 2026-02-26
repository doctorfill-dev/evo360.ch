import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    services: defineCollection({
      source: 'services/*.md',
      type: 'page',
      schema: z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        image: z.string(),
        order: z.number()
      })
    }),
    testimonials: defineCollection({
      source: 'testimonials/*.md',
      type: 'page',
      schema: z.object({
        name: z.string(),
        age: z.string(),
        initial: z.string(),
        text: z.string(),
        color: z.string(),
        order: z.number()
      })
    }),
    sections: defineCollection({
      source: 'sections/*.md',
      type: 'page',
      schema: z.object({
        badge: z.string().optional(),
        title: z.string(),
        description: z.string().optional(),
        img1: z.string().optional(),
        img2: z.string().optional(),
        img3: z.string().optional(),
        lead: z.string().optional(),
        quote: z.string().optional(),
        image: z.string().optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        access: z.string().optional(),
        cta_title: z.string().optional(),
        cta_text: z.string().optional(),
        cta_btn: z.string().optional(),
        cta_link: z.string().optional()
      })
    })
  }
})
