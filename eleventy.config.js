// eleventy.config.js
// C'est le cerveau du projet : il dit à Eleventy où chercher quoi, et comment se comporter.

export default function (eleventyConfig) {

  // --- Extensions personnalisées ---
  // Keystatic utilise .mdoc (Markdoc) pour les collections avec champ document.
  // On dit à Eleventy de traiter les .mdoc exactement comme du Markdown.
  eleventyConfig.addExtension("mdoc", {
    key: "md",
  });

  // --- CSS Minification (post-build) ---
  // Minifie style.css dans _site/assets/css/ après la copie passthrough
  eleventyConfig.on("eleventy.after", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const cssPath = path.default.join("_site", "assets", "css", "style.css");
    if (fs.default.existsSync(cssPath)) {
      let css = fs.default.readFileSync(cssPath, "utf8");
      // Strip comments (except /*! ... */ licence)
      css = css.replace(/\/\*(?!\!)[\s\S]*?\*\//g, "");
      // Collapse whitespace
      css = css.replace(/\s+/g, " ");
      // Remove spaces around delimiters
      css = css.replace(/\s*([{}:;,>~+])\s*/g, "$1");
      // Remove trailing semicolons before closing brace
      css = css.replace(/;}/g, "}");
      // Trim
      css = css.trim();
      fs.default.writeFileSync(cssPath, css);
    }
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

  // Trie les services selon le champ `order` du CMS.
  // Usage : {% set services = collections.services | removeHidden | sortByOrder %}
  eleventyConfig.addFilter("sortByOrder", (services) => {
    if (!services) return [];
    return [...services].sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
  });

  // Retire du sous-menu Services les liens vers des fiches masquées dans le CMS.
  eleventyConfig.addFilter("filterHiddenServiceLinks", (links, services) => {
    if (!links || !services) return links || [];
    const hiddenSlugs = new Set(
      services
        .filter(service => service.data.hide === true || service.data.hide === "true")
        .map(service => service.fileSlug)
    );
    return links.filter(link => {
      const slug = (link.url || '').replace(/^\/services\//, '').replace(/\/$/, '');
      return !hiddenSlugs.has(slug);
    });
  });

  // Filtre findServiceIndex : retourne l'index du service courant dans la collection triée
  // Usage : {% set currentIndex = allServices | findServiceIndex(page.url) %}
  eleventyConfig.addFilter("findServiceIndex", (allServices, currentUrl) => {
    if (!allServices || !currentUrl) return -1;
    return allServices.findIndex(s => s.url === currentUrl);
  });

  // Filtre jsonEscape : échappe une valeur pour injection sûre dans un bloc JSON-LD
  // Nunjucks auto-échappe les " en &quot; — ce filtre + | safe contourne ce bug.
  // Usage : {{ value | jsonEscape | safe }}
  eleventyConfig.addFilter("jsonEscape", (str) => {
    if (str == null) return '';
    return String(str)
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
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
