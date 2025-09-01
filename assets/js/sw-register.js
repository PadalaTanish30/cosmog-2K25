// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(registration => {
        // Registration succeeded
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}