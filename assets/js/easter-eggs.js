// Simple CoSmoG Easter Egg
// Triggers (works on the homepage and any page that loads this script):
// - Press the "E" key anywhere (not inside a form field)
// - Click once on the footer area
(function () {
  if (window.__EGG_SIMPLE__) return; // guard against double-loads
  window.__EGG_SIMPLE__ = true;

  function ensureStyles() {
    if (document.getElementById('egg-simple-styles')) return;
    const style = document.createElement('style');
    style.id = 'egg-simple-styles';
    style.textContent = `
      .egg-toast { position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); z-index: 9999; background: var(--panel, #111); color: var(--text, #fafafa); border: 1px solid var(--border, #262626); box-shadow: 0 10px 30px rgba(0,0,0,.55); border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; gap: 10px; font: 14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Arial; }
      .egg-toast .egg-title { font-weight: 800; margin-right: 6px; color: var(--brand, #ffd000); }
      .egg-toast .egg-close { margin-left: 6px; background: transparent; border: 0; color: var(--muted, #b8b8b8); cursor: pointer; font-size: 12px; }
      .egg-toast .egg-close:hover { color: var(--text, #fafafa); }
      @keyframes egg-pop { 0% { transform: translateX(-50%) translateY(8px); opacity: 0 } 100% { transform: translateX(-50%) translateY(0); opacity: 1 } }
      .egg-toast { animation: egg-pop .2s ease-out; }
    `;
    document.head.appendChild(style);
  }

  function showToast(message, title) {
    ensureStyles();
    const existing = document.getElementById('egg-simple-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'egg-simple-toast';
    toast.className = 'egg-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    const strong = document.createElement('span');
    strong.className = 'egg-title';
    strong.textContent = title || 'CoSmoG';

    const span = document.createElement('span');
    span.textContent = message || 'UNLEASH THE STAR IN YOU';

    const btn = document.createElement('button');
    btn.className = 'egg-close';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Close');
    btn.textContent = 'Dismiss';
    btn.onclick = () => toast.remove();

    toast.append(strong, span, btn);
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 5000);
  }

  // Keyboard trigger: press "E" (outside inputs)
  window.addEventListener('keydown', (e) => {
    const target = e.target;
    const tag = (target && target.tagName) ? target.tagName.toLowerCase() : '';
    const typing = tag === 'input' || tag === 'textarea' || tag === 'select' || (target && target.isContentEditable);
    if (typing) return;
    const key = e.key || '';
    if (key.toLowerCase() === 'e') {
      showToast('Hello there! You found the easter egg.', 'CoSmoG');
    }
  });

  // Click trigger: click once on the footer area
  document.addEventListener('DOMContentLoaded', () => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    footer.addEventListener('click', () => {
      showToast('Welcome to CoSmoG! See you at the event.', 'CoSmoG');
    }, { once: true });
  });
})();
