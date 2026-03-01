// eleventy.config.js
// C'est le cerveau du projet : il dit à Eleventy où chercher quoi, et comment se comporter.

export default function (eleventyConfig) {

  // --- Passthrough Copy ---
  // Ces dossiers sont copiés tels quels dans _site/, sans transformation.
  // Utile pour les CSS, images, fonts, JS client...
  eleventyConfig.addPassthroughCopy("src/assets");

  // Fichier _redirects pour Cloudflare Pages (routing SPA Keystatic + redirects)
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });

  // --- Filtres personnalisés ---
  // Un filtre s'utilise dans les templates : {{ date | readableDate }}
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("fr-CH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  // Filtre pour l'année courante : {{ "" | currentYear }}
  eleventyConfig.addFilter("currentYear", () => {
    return new Date().getFullYear();
  });

  // --- Configuration des dossiers ---
  return {
    // Moteur de template par défaut pour les fichiers .html et .md
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",

    dir: {
      input: "src",           // Eleventy lit tout ce qui est dans src/
      output: "_site",        // Eleventy génère le HTML final dans _site/
      includes: "_includes",  // Relatif à `input` → src/_includes/
      data: "_data",          // Relatif à `input` → src/_data/
    },
  };
}
