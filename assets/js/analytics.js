// Google Analytics 4 implementation
(function() {
  // Replace with your actual Google Analytics measurement ID
  const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

  // Load the Google Analytics script
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);

  // Create and append the Google Analytics script tag
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Basic event tracking for page views
  document.addEventListener('DOMContentLoaded', function() {
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname
    });
  });

  // Track outbound links
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.hostname !== window.location.hostname) {
      gtag('event', 'outbound_link', {
        destination: link.href
      });
    }
  });

  // Track form submissions
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function() {
      gtag('event', 'form_submit', {
        form_id: form.id || 'unknown'
      });
    });
  });

  })();