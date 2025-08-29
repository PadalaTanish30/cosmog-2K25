/**
 * Responsive Images Script
 * Enhances image loading with responsive sizes and WebP support
 */

document.addEventListener('DOMContentLoaded', function() {
  // Convert regular images to responsive picture elements with WebP support
  function enhanceImages() {
    const images = document.querySelectorAll('img:not(.no-enhance)');
    
    images.forEach(function(img) {
      // Skip already enhanced images
      if (img.closest('picture')) return;
      
      // Get image attributes
      const src = img.getAttribute('src');
      const alt = img.getAttribute('alt') || '';
      const className = img.className;
      const style = img.getAttribute('style') || '';
      const width = img.getAttribute('width');
      const height = img.getAttribute('height');
      
      // Skip SVGs and data URLs
      if (src && (src.endsWith('.svg') || src.startsWith('data:'))) return;
      
      // Create picture element
      const picture = document.createElement('picture');
      
      // Only add WebP source if it's a JPG or PNG
      if (src && (src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png'))) {
        // Create WebP source
        const webpSource = document.createElement('source');
        const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        webpSource.setAttribute('srcset', webpSrc);
        webpSource.setAttribute('type', 'image/webp');
        picture.appendChild(webpSource);
      }
      
      // Create fallback source
      const fallbackSource = document.createElement('source');
      fallbackSource.setAttribute('srcset', src);
      picture.appendChild(fallbackSource);
      
      // Create new img element
      const newImg = document.createElement('img');
      newImg.setAttribute('src', src);
      newImg.setAttribute('alt', alt);
      newImg.className = className;
      if (style) newImg.setAttribute('style', style);
      if (width) newImg.setAttribute('width', width);
      if (height) newImg.setAttribute('height', height);
      
      // Add loading="lazy" for images below the fold
      if (!isInViewport(img)) {
        newImg.setAttribute('loading', 'lazy');
      }
      
      picture.appendChild(newImg);
      
      // Replace original img with picture element
      img.parentNode.replaceChild(picture, img);
    });
  }
  
  // Check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  // Apply responsive image enhancements
  enhanceImages();
  
  // Handle dynamically added images
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        enhanceImages();
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
});