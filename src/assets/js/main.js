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
    if (status === 'accepted') {
      initGA();
    }
  };

  if (acceptBtn) acceptBtn.addEventListener('click', () => handleConsent('accepted'));
  if (declineBtn) declineBtn.addEventListener('click', () => handleConsent('declined'));

  // --- Google Analytics ---
  function initGA() {
    const gaId = 'G-ZMF20R1Q0M';
    if (window.gaInitialized) return;
    
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', gaId);
    window.gaInitialized = true;
  }

  if (localStorage.getItem('cookie-consent') === 'accepted') {
    initGA();
  }
});
