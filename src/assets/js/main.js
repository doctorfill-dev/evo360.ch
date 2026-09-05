document.addEventListener('DOMContentLoaded', () => {
  // --- Smooth Scroll ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || !href.startsWith('#')) return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Cookie Consent ---
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (banner && !localStorage.getItem('cookie-consent')) {
    banner.hidden = false;
  }

  const handleConsent = (status) => {
    localStorage.setItem('cookie-consent', status);
    banner.hidden = true;
    if (status === 'accepted') initOptionalServices();
  };

  if (acceptBtn) acceptBtn.addEventListener('click', () => handleConsent('accepted'));
  if (declineBtn) declineBtn.addEventListener('click', () => handleConsent('declined'));

  // --- Google Analytics ---
  function initGA() {
    const gaId = document.currentScript?.dataset.gaMeasurementId || document.querySelector('script[data-ga-measurement-id]')?.dataset.gaMeasurementId;
    if (!gaId) return;
    if (window.gaInitialized) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    // Expose gtag globally so conversion events can be fired from anywhere
    window.gtag = function(){dataLayer.push(arguments);};
    window.gtag('js', new Date());
    window.gtag('config', gaId);
    window.gaInitialized = true;
  }

  function loadThirdPartyEmbeds() {
    document.querySelectorAll('[data-third-party-src]').forEach((element) => {
      if (element.dataset.loaded) return;
      const src = element.dataset.thirdPartySrc;
      if (!src) return;
      if (element.tagName === 'IFRAME') element.src = src;
      else if (element.dataset.embedType === 'instagram') {
        const script = document.createElement('script');
        script.async = true;
        script.src = src;
        document.head.appendChild(script);
      }
      element.dataset.loaded = 'true';
    });
    document.querySelectorAll('[data-third-party-placeholder]').forEach(placeholder => {
      placeholder.hidden = true;
    });
  }

  function initOptionalServices() { initGA(); loadThirdPartyEmbeds(); }

  document.querySelectorAll('[data-load-third-party]').forEach(button => {
    button.addEventListener('click', () => {
      localStorage.setItem('cookie-consent', 'accepted');
      initOptionalServices();
      const placeholder = button.closest('[data-third-party-placeholder]');
      if (placeholder) placeholder.hidden = true;
    });
  });

  if (localStorage.getItem('cookie-consent') === 'accepted') initOptionalServices();
});
