// CoSmoG Easter Eggs
// Triggers:
// 1) Five rapid clicks on the header logo (within 4 seconds)
// 2) Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A

(function () {
  if (window.__EGG_ENABLED__) return; // guard
  window.__EGG_ENABLED__ = true;

  // Utilities
  function $(sel, root) { return (root || document).querySelector(sel); }

  function ensureStyles() {
    if (document.getElementById('egg-styles')) return;
    const style = document.createElement('style');
    style.id = 'egg-styles';
    style.textContent = `
      .egg-toast { position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); z-index: 9999; background: var(--panel); color: var(--text); border: 1px solid var(--border); box-shadow: var(--shadow); border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; gap: 10px; }
      .egg-toast .egg-close { background: transparent; border: 0; color: var(--muted); cursor: pointer; font-size: 14px; }
      .egg-toast .egg-close:hover { color: var(--text); }
      .egg-toast .egg-title { font-weight: 700; margin-right: 6px; }
      .egg-toast .egg-msg { opacity: 0.9; }
      .egg-hidden { display: none !important; }

      /* Subtle starfield theme when unlocked */
      body.egg-starfield::after { content: ''; position: fixed; inset: 0; pointer-events: none; background:
        radial-gradient(1px 1px at 10% 20%, rgba(255, 208, 0, .35) 50%, transparent 51%),
        radial-gradient(1px 1px at 30% 80%, rgba(255, 208, 0, .3) 50%, transparent 51%),
        radial-gradient(1px 1px at 60% 30%, rgba(255, 208, 0, .25) 50%, transparent 51%),
        radial-gradient(1px 1px at 85% 60%, rgba(255, 208, 0, .35) 50%, transparent 51%);
        animation: egg-twinkle 2.5s linear infinite; }
      @keyframes egg-twinkle { 0%, 100% { opacity: .25 } 50% { opacity: .7 } }
    `;
    document.head.appendChild(style);
  }

  function showToast(message, title) {
    ensureStyles();
    // Remove existing
    const existing = document.getElementById('egg-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'egg-toast';
    toast.className = 'egg-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    const strong = document.createElement('span');
    strong.className = 'egg-title';
    strong.textContent = title || 'Easter egg unlocked!';

    const span = document.createElement('span');
    span.className = 'egg-msg';
    span.textContent = message || 'UNLEASH THE STAR IN YOU';

    const btn = document.createElement('button');
    btn.className = 'egg-close';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Close');
    btn.textContent = 'Dismiss';
    btn.onclick = () => toast.remove();

    toast.append(strong, span, btn);
    document.body.appendChild(toast);

    // Auto-hide after 6s
    setTimeout(() => toast.remove(), 6000);
  }

  function pulseStarfield(ms) {
    document.body.classList.add('egg-starfield');
    setTimeout(() => document.body.classList.remove('egg-starfield'), ms || 10000);
  }

  // Trigger 1: 5 rapid clicks on the header logo/brand
  document.addEventListener('DOMContentLoaded', () => {
    const brand = $('.brand');
    if (!brand) return;
    let clicks = 0;
    let timer = null;

    brand.addEventListener('click', () => {
      clicks += 1;
      if (!timer) {
        timer = setTimeout(() => { clicks = 0; timer = null; }, 4000);
      }
      if (clicks >= 5) {
        clearTimeout(timer); clicks = 0; timer = null;
        showToast('You found the hidden message. Welcome to CoSmoG!', 'CoSmoG');
        pulseStarfield(10000);
        try { localStorage.setItem('egg:logo', '1'); } catch {}
      }
    });
  });

  // Trigger 2: Konami Code (Up,Up,Down,Down,Left,Right,Left,Right,B,A)
  (function () {
    const sequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let pos = 0;
    window.addEventListener('keydown', (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key; // normalize
      if (key === sequence[pos]) {
        pos += 1;
        if (pos === sequence.length) {
          pos = 0;
          showToast('Design + Tech = Magic. See you at the event!', 'Konami Mode');
          pulseStarfield(12000);
          try { localStorage.setItem('egg:konami', '1'); } catch {}
        }
      } else {
        pos = 0;
      }
    });
  })();
})();
