// Theme toggle and mobile menu
(function () {
  document.addEventListener('click', function (e) {
    const t = e.target;
    if (t && (t.matches('[data-menu]') || t.closest('[data-menu]'))) {
      e.preventDefault();
      const btn = t.closest('[data-menu]') || t;
      const header = btn.closest('header');
      const links = header ? header.querySelector('.nav-links') : document.querySelector('.nav-links');
      if (links) {
        links.classList.toggle('open');
        btn.setAttribute('aria-expanded', links.classList.contains('open') ? 'true' : 'false');
      }
    }
    // Close mobile menu after navigating
    if (t && t.matches('.nav-links a')) {
      const header = t.closest('header');
      const links = header ? header.querySelector('.nav-links') : null;
      if (links) links.classList.remove('open');
    }
    if (t && t.matches('.faq q, .faq .q')) {
      const item = t.closest('.qa');
      if (item) item.classList.toggle('open');
    }
    // Open registration modal
    if (t && (t.matches('[data-register]') || t.closest('[data-register]'))) {
      const btn = t.closest('[data-register]') || t;
      const card = btn.closest('.card');
      const title = card ? card.querySelector('h3')?.textContent?.trim() : 'Registration';
      const amount = btn.getAttribute('data-amount') || '';
      openRegistrationModal({ eventTitle: title, amount });
    }
    if (t && t.matches('[data-modal-close]')) {
      closeRegistrationModal();
    }
  });

  // Countdown if present
  const countdownEl = document.querySelector('[data-countdown]');
  if (countdownEl) {
    const targetIso = countdownEl.getAttribute('data-countdown');
    const target = targetIso ? new Date(targetIso) : null;
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');
    function update() {
      if (!target) return;
      const now = new Date();
      const diff = Math.max(0, target - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
      if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
    }
    update();
    setInterval(update, 1000);
  }
})();

// Close modal on ESC
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeRegistrationModal();
});

// Registration modal logic
function openRegistrationModal(opts) {
  const { eventTitle, amount } = opts || {};
  let backdrop = document.getElementById('reg-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'reg-backdrop';
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <header>
          <div><strong id="reg-title"></strong></div>
          <button class="btn" data-modal-close>Close</button>
        </header>
        <div class="content">
          <div class="steps">
            <span class="step step-1 active">1. Details</span>
            <span class="step step-2">2. UPI Payment</span>
            <span class="step step-3">3. Upload</span>
            <span class="step step-4">4. Success</span>
          </div>
          <form id="reg-form" class="step-pane step-pane-1">
            <div class="row" style="gap:10px; align-items:stretch;">
              <div style="flex:1">
                <label>Name</label>
                <input name="name" required placeholder="Your full name" />
              </div>
              <div style="flex:1">
                <label>Roll No</label>
                <input name="roll" required placeholder="e.g., 22CSD123" />
              </div>
            </div>
            <div class="row" style="gap:10px; align-items:stretch; margin-top:10px;">
              <div style="flex:1">
                <label>Branch</label>
                <input name="branch" required placeholder="e.g., CSD/CSG" />
              </div>
            </div>
            <div class="actions">
              <button type="button" class="btn primary" id="reg-next">Proceed</button>
            </div>
          </form>
          <div class="step-pane step-pane-2" style="display:none;">
            <div class="qr-box">
              <img id="upi-img" alt="UPI QR" width="240" height="240" style="background:#fff; border-radius:8px; object-fit: contain;" />
              <div class="note">Scan the QR with your UPI app to pay. After payment, upload a screenshot of your transaction.</div>
              <div class="actions">
                <a class="btn" id="upi-intent" target="_blank" rel="noopener">Open UPI App</a>
                <button class="btn primary" id="upload-btn">Upload Screenshot</button>
              </div>
            </div>
          </div>
          <div class="step-pane step-pane-3" style="display:none;">
            <div class="upload-box">
              <h4>Upload Payment Screenshot</h4>
              <input type="file" id="screenshot-upload" accept="image/*" style="margin: 10px 0;" />
              <div class="note">Please upload a clear screenshot of your UPI payment confirmation.</div>
              <div class="actions">
                <button class="btn" id="back-btn">Back</button>
                <button class="btn primary" id="submit-btn">Submit Registration</button>
              </div>
            </div>
          </div>
          <div class="step-pane step-pane-4" style="display:none;">
            <div class="success-box">
              <div style="font-size: 48px; margin-bottom: 16px;">⭐</div>
              <h3>Hey STAR! 🌟</h3>
              <p>Thank you for registering for <strong id="event-name"></strong>!</p>
              <p>We're excited to see you at CoSmoG. Your registration has been confirmed.</p>
              <div class="note">Check your email for further details. See you at the event!</div>
              <div class="actions">
                <button class="btn primary" data-modal-close>Awesome! 🚀</button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', (ev) => {
      if (ev.target === backdrop) closeRegistrationModal();
    });
    const nextBtn = backdrop.querySelector('#reg-next');
    nextBtn.addEventListener('click', () => {
      const form = backdrop.querySelector('#reg-form');
      if (!form.reportValidity()) return;
      // Build UPI URL
      const upiId = (document.querySelector('meta[name="upi-id"]')?.getAttribute('content')) || 'upi-id-not-set@upi';
      const metaAmount = (document.querySelector('meta[name="upi-amount"]')?.getAttribute('content')) || '';
      const amt = amount || metaAmount || '0';
      const name = form.querySelector('input[name="name"]').value.trim();
      const roll = form.querySelector('input[name="roll"]').value.trim();
      const branch = form.querySelector('input[name="branch"]').value.trim();
      const note = `${eventTitle || 'Event'} | ${name} | ${roll} | ${branch}`.slice(0, 80);
      const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('CoSmoG')}&am=${encodeURIComponent(amt)}&cu=INR&tn=${encodeURIComponent(note)}`;
      const intent = backdrop.querySelector('#upi-intent');
      intent.href = upiUrl;
      // Set static UPI QR image
      const upiImg = backdrop.querySelector('#upi-img');
      if (upiImg) upiImg.src = 'assets/img/GooglePay_QR.png';
      // Switch step
      backdrop.querySelector('.step-1').classList.remove('active');
      backdrop.querySelector('.step-2').classList.add('active');
      backdrop.querySelector('.step-pane-1').style.display = 'none';
      backdrop.querySelector('.step-pane-2').style.display = 'block';
    });

    // Upload button
    const uploadBtn = backdrop.querySelector('#upload-btn');
    uploadBtn.addEventListener('click', () => {
      backdrop.querySelector('.step-2').classList.remove('active');
      backdrop.querySelector('.step-3').classList.add('active');
      backdrop.querySelector('.step-pane-2').style.display = 'none';
      backdrop.querySelector('.step-pane-3').style.display = 'block';
    });

    // Back button
    const backBtn = backdrop.querySelector('#back-btn');
    backBtn.addEventListener('click', () => {
      backdrop.querySelector('.step-3').classList.remove('active');
      backdrop.querySelector('.step-2').classList.add('active');
      backdrop.querySelector('.step-pane-3').style.display = 'none';
      backdrop.querySelector('.step-pane-2').style.display = 'block';
    });

    // Submit button
    const submitBtn = backdrop.querySelector('#submit-btn');
    submitBtn.addEventListener('click', () => {
      const fileInput = backdrop.querySelector('#screenshot-upload');
      if (!fileInput.files.length) {
        alert('Please upload a screenshot first');
        return;
      }
      // Show success
      backdrop.querySelector('.step-3').classList.remove('active');
      backdrop.querySelector('.step-4').classList.add('active');
      backdrop.querySelector('.step-pane-3').style.display = 'none';
      backdrop.querySelector('.step-pane-4').style.display = 'block';
      backdrop.querySelector('#event-name').textContent = eventTitle || 'the event';
    });
  }
  backdrop.querySelector('#reg-title').textContent = `${eventTitle || 'Registration'}`;
  backdrop.classList.add('open');
  const focusEl = backdrop.querySelector('input, button');
  if (focusEl) focusEl.focus();
}

function closeRegistrationModal() {
  const backdrop = document.getElementById('reg-backdrop');
  if (backdrop) backdrop.classList.remove('open');
}

// Minimal QR generator (naive): uses external API fallback if canvas not supported
// (Dynamic QR generation removed in favor of static image)

// Web Share for event cards
document.addEventListener('click', function (e) {
  const t = e.target;
  if (t && (t.matches('[data-share]') || t.closest('[data-share]'))) {
    const card = t.closest('.card');
    const title = card ? card.querySelector('h3')?.textContent?.trim() : document.title;
    const text = `Join me at ${title} - CoSmoG`;
    const url = window.location.origin + window.location.pathname;
    if (navigator.share) {
      navigator.share({ title, text, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      alert('Link copied to clipboard');
    }
  }
});

// Announcement bar dismiss
(function () {
  const bar = document.getElementById('announce');
  if (!bar) return;
  if (localStorage.getItem('announce:dismissed') === '1') {
    bar.style.display = 'none';
    return;
  }
  bar.addEventListener('click', function (e) {
    if (e.target && e.target.matches('[data-dismiss]')) {
      e.preventDefault();
      e.stopPropagation();
      localStorage.setItem('announce:dismissed', '1');
      bar.style.display = 'none';
    }
  });
})();

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

