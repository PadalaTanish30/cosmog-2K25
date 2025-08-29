/**
 * Image Loader Script
 * Enhances image loading by lazy loading and providing WebP support where available
 */

document.addEventListener('DOMContentLoaded', function() {
  // Check if the browser supports WebP
  function checkWebpSupport(callback) {
    const webpImg = new Image();
    webpImg.onload = function() {
      const result = (webpImg.width > 0) && (webpImg.height > 0);
      callback(result);
    };
    webpImg.onerror = function() {
      callback(false);
    };
    webpImg.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
  }

  // Apply WebP support if available
  checkWebpSupport(function(hasWebpSupport) {
    if (hasWebpSupport) {
      document.documentElement.classList.add('webp-support');
    } else {
      document.documentElement.classList.add('no-webp-support');
    }
  });

  // Lazy load images
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(function(img) {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    lazyImages.forEach(function(img) {
      img.src = img.dataset.src;
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
      }
      img.classList.add('loaded');
    });
  }
});