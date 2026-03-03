// eleventy.config.js
// C'est le cerveau du projet : il dit à Eleventy où chercher quoi, et comment se comporter.

export default function (eleventyConfig) {

  // --- Extensions personnalisées ---
  // Keystatic utilise .mdoc (Markdoc) pour les collections avec champ document.
  // On dit à Eleventy de traiter les .mdoc exactement comme du Markdown.
  eleventyConfig.addExtension("mdoc", {
    key: "md",
  });

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

  // Filtre padStart : {{ 1 | padStart(2, '0') }} -> "01"
  eleventyConfig.addFilter("padStart", (str, targetLength, padString) => {
    return String(str).padStart(targetLength, padString);
  });

  // Filtre pour l'année courante : {{ "" | currentYear }}
  eleventyConfig.addFilter("currentYear", () => {
    return new Date().getFullYear();
  });

  // Filtre isoDate : {{ date | isoDate }} -> "2024-01-15"
  eleventyConfig.addFilter("isoDate", (dateObj) => {
    return new Date(dateObj).toISOString().split('T')[0];
  });

  // Filtre findServiceIndex : retourne l'index du service courant dans la collection triée
  // Usage : {% set currentIndex = allServices | findServiceIndex(page.url) %}
  eleventyConfig.addFilter("findServiceIndex", (allServices, currentUrl) => {
    if (!allServices || !currentUrl) return -1;
    return allServices.findIndex(s => s.url === currentUrl);
  });

  // --- Configuration des dossiers ---
  return {
    // Formats de templates reconnus (mdoc ajouté pour Keystatic)
    templateFormats: ["md", "mdoc", "njk", "html", "liquid", "11ty.js"],

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
