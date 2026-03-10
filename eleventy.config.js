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

  // Filtre toPublicPath : convertit un chemin repo Keystatic en URL publique
  // "src/assets/img/bilans.jpg" → "/assets/img/bilans.jpg"
  // Passe les chemins déjà publics tels quels ("/assets/img/bilans.jpg" → "/assets/img/bilans.jpg")
  eleventyConfig.addFilter("toPublicPath", (path) => {
    if (!path) return '';
    if (path.startsWith('/')) return path;           // déjà un chemin public
    if (path.startsWith('src/')) return '/' + path.slice(4); // src/assets/… → /assets/…
    return '/' + path;
  });

  // Filtre removeHidden : retire les services masqués (hide: true) d'une collection Eleventy
  // Usage : {% set visible = collections.services | removeHidden %}
  eleventyConfig.addFilter("removeHidden", (services) => {
    if (!services) return [];
    return services.filter(s => {
      const hide = s.data.hide;
      return hide !== true && hide !== "true";
    });
  });

  // Filtre filterHiddenHomeServices : retire de la liste homepage les services
  // dont le .mdoc a hide: true, en croisant par slug (le nom du fichier .mdoc)
  // Usage : {% for s in home.services.items | filterHiddenHomeServices(collections.services) %}
  eleventyConfig.addFilter("filterHiddenHomeServices", (homeServices, collectionServices) => {
    if (!homeServices || !collectionServices) return homeServices || [];
    const hiddenSlugs = new Set(
      collectionServices
        .filter(s => s.data.hide === true || s.data.hide === "true")
        .map(s => s.fileSlug)
    );
    return homeServices.filter(item => {
      // Extraire le slug depuis l'URL : "/services/neurotracker/" → "neurotracker"
      const slug = (item.url || '').replace(/^\/services\//, '').replace(/\/$/, '');
      return !hiddenSlugs.has(slug);
    });
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
