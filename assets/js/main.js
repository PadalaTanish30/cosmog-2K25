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
              <div style="flex:1">
                <label>Email (optional)</label>
                <input name="email" type="email" placeholder="you@example.com" />
              </div>
            </div>
            <div class="actions">
              <button type="button" class="btn primary" id="reg-next">Proceed</button>
            </div>
          </form>
          <div class="step-pane step-pane-2" style="display:none;">
            <div class="qr-box">
              <img id="upi-img" alt="UPI QR" width="240" height="240" style="background:#fff; border-radius:8px; object-fit: contain;" />
              <div class="note">Scan the QR with your UPI app to pay. After payment, enter your transaction ID and upload a screenshot.</div>
              <div class="transaction-id-input">
                <label for="transaction-id">Transaction ID</label>
                <input id="transaction-id" name="transaction_id" required placeholder="Enter your UPI transaction ID" />
                <div class="hint">You can find this in your payment app's transaction history</div>
              </div>
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
                            <h3>Registration Confirmed</h3>
              <p>Thank you for registering for <strong id="event-name"></strong>!</p>
              <p>We're excited to see you at CoSmoG. Your registration has been confirmed.</p>
              <div class="content"><!-- Payment details will be inserted here --></div>
              <div class="note">Check your email for further details. See you at the event!</div>
              <div class="actions">
                <button class="btn" id="download-receipt" style="display:none;">Download Receipt</button>
                <button class="btn primary" data-modal-close>Close</button>
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
      const amtNum = String((amount || metaAmount || '0')).replace(/[^\d.]/g, '');
      const name = form.querySelector('input[name="name"]').value.trim();
      const roll = form.querySelector('input[name="roll"]').value.trim();
      const branch = form.querySelector('input[name="branch"]').value.trim();

      // Validate UPI configuration
      if (!upiId || upiId.includes('not-set') || !/.+@.+/.test(upiId)) {
        alert('Payment is not configured. Please contact support.');
        return;
      }

      // Allow zero-amount (free) registrations; only block negative/invalid
      if ((amount || metaAmount) && (!amtNum || Number(amtNum) < 0)) {
        alert('Payment amount is not set. Please try again later.');
        return;
      }

      const note = `${eventTitle || 'Event'} | ${name} | ${roll} | ${branch}`.slice(0, 80);
      const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('CoSmoG')}&am=${encodeURIComponent(amtNum || '0')}&cu=INR&tn=${encodeURIComponent(note)}`;
      const intent = backdrop.querySelector('#upi-intent');
      intent.href = upiUrl;
      // Set static UPI QR image
      const upiImg = backdrop.querySelector('#upi-img');
      if (upiImg) upiImg.src = 'assets/img/GooglePay_QR.png';
      // Switch step with accessibility updates
      backdrop.querySelector('.step-1').classList.remove('active');
      backdrop.querySelector('.step-2').classList.add('active');
      const pane1 = backdrop.querySelector('.step-pane-1');
      const pane2 = backdrop.querySelector('.step-pane-2');
      if (pane1) { pane1.style.display = 'none'; pane1.setAttribute('aria-hidden', 'true'); }
      if (pane2) { pane2.style.display = 'block'; pane2.setAttribute('aria-hidden', 'false'); const first = pane2.querySelector('input, button, a'); if (first) first.focus(); }
      const step1 = backdrop.querySelector('.step-1');
      const step2 = backdrop.querySelector('.step-2');
      if (step1) step1.setAttribute('aria-current', 'false');
      if (step2) step2.setAttribute('aria-current', 'step');
    });

    // Upload button
    const uploadBtn = backdrop.querySelector('#upload-btn');
    uploadBtn.addEventListener('click', () => {
      // Validate transaction ID before proceeding
      const transactionIdInput = backdrop.querySelector('#transaction-id');
      const transactionId = transactionIdInput.value.trim();
      
      // Check if validateTransactionID function exists (from form-validation.js)
      if (typeof validateTransactionID === 'function') {
        const validation = validateTransactionID(transactionId);
        
        // Clear previous validation styling
        transactionIdInput.classList.remove('valid', 'invalid');
        const transactionIdContainer = transactionIdInput.closest('.transaction-id-input');
        const existingError = transactionIdContainer.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        if (!validation.isValid) {
          // Show error message
          transactionIdInput.classList.add('invalid');
          const errorMessage = document.createElement('div');
          errorMessage.className = 'error-message';
          errorMessage.textContent = validation.message;
          transactionIdContainer.appendChild(errorMessage);
          transactionIdInput.focus();
          return;
        } else {
          // Show success styling
          transactionIdInput.classList.add('valid');
          transactionIdContainer.classList.add('valid');
        }
      } else {
        // Basic validation if the function doesn't exist
        if (!/^[A-Za-z0-9._-]{8,}$/.test(transactionId)) {
          alert('Please enter a valid transaction ID');
          transactionIdInput.focus();
          return;
        }
      }
      
      // Proceed to next step with accessibility updates
      backdrop.querySelector('.step-2').classList.remove('active');
      backdrop.querySelector('.step-3').classList.add('active');
      const pane2b = backdrop.querySelector('.step-pane-2');
      const pane3 = backdrop.querySelector('.step-pane-3');
      if (pane2b) { pane2b.style.display = 'none'; pane2b.setAttribute('aria-hidden', 'true'); }
      if (pane3) { pane3.style.display = 'block'; pane3.setAttribute('aria-hidden', 'false'); const first = pane3.querySelector('input, button, a'); if (first) first.focus(); }
      const step2b = backdrop.querySelector('.step-2');
      const step3 = backdrop.querySelector('.step-3');
      if (step2b) step2b.setAttribute('aria-current', 'false');
      if (step3) step3.setAttribute('aria-current', 'step');
    });

    // Add real-time validation for transaction ID
    const transactionIdInput = backdrop.querySelector('#transaction-id');
    if (transactionIdInput) {
      transactionIdInput.addEventListener('input', function() {
        // Remove any existing validation classes while typing
        this.classList.remove('valid', 'invalid');
        const container = this.closest('.transaction-id-input');
        container.classList.remove('valid');
        
        // Remove any existing error message
        const existingError = container.querySelector('.error-message');
        if (existingError) existingError.remove();
      });
      
      transactionIdInput.addEventListener('blur', function() {
        const transactionId = this.value.trim();
        
        // Skip validation if empty (will be caught on form submission)
        if (!transactionId) return;
        
        // Validate if the function exists
        if (typeof validateTransactionID === 'function') {
          const validation = validateTransactionID(transactionId);
          
          // Clear previous validation styling
          this.classList.remove('valid', 'invalid');
          const container = this.closest('.transaction-id-input');
          container.classList.remove('valid');
          
          // Remove any existing error message
          const existingError = container.querySelector('.error-message');
          if (existingError) existingError.remove();
          
          if (!validation.isValid) {
            // Show error message
            this.classList.add('invalid');
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = validation.message;
            container.appendChild(errorMessage);
          } else {
            // Show success styling
            this.classList.add('valid');
            container.classList.add('valid');
          }
        }
      });
    }
    
    // Back button
    const backBtn = backdrop.querySelector('#back-btn');
    backBtn.addEventListener('click', () => {
      backdrop.querySelector('.step-3').classList.remove('active');
      backdrop.querySelector('.step-2').classList.add('active');
      const pane3c = backdrop.querySelector('.step-pane-3');
      const pane2c = backdrop.querySelector('.step-pane-2');
      if (pane3c) { pane3c.style.display = 'none'; pane3c.setAttribute('aria-hidden', 'true'); }
      if (pane2c) { pane2c.style.display = 'block'; pane2c.setAttribute('aria-hidden', 'false'); const first = pane2c.querySelector('input, button, a'); if (first) first.focus(); }
      const step3c = backdrop.querySelector('.step-3');
      const step2c = backdrop.querySelector('.step-2');
      if (step3c) step3c.setAttribute('aria-current', 'false');
      if (step2c) step2c.setAttribute('aria-current', 'step');
    });

    // Submit button
    const submitBtn = backdrop.querySelector('#submit-btn');
    submitBtn.addEventListener('click', () => {
      const fileInput = backdrop.querySelector('#screenshot-upload');
      if (!fileInput.files.length) {
        alert('Please upload a screenshot first');
        return;
      }
      
      // In a real implementation, you would upload the file to a server
      // For this demo, we'll simulate a successful upload with basic validations
      const file = fileInput.files[0];
      if (!file || !(file.type || '').startsWith('image/')) {
        alert('Please upload an image file (PNG/JPEG/WebP).');
        return;
      }
      const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
      if (file.size > MAX_SIZE) {
        alert('Please upload an image smaller than 5 MB.');
        return;
      }
      // Helper: read file as Data URL
      const readAsDataURL = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      // Helper: compress image with canvas
      const compressImage = (file, maxW = 1280, maxH = 1280, quality = 0.8) => new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
          let { width, height } = img;
          const ratio = Math.min(maxW / width, maxH / height, 1);
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(width * ratio);
          canvas.height = Math.round(height * ratio);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);
          try {
            const targetType = (file.type && file.type.includes('png')) ? 'image/png' : (file.type && file.type.includes('webp')) ? 'image/webp' : 'image/jpeg';
            const dataUrl = (targetType === 'image/jpeg' || targetType === 'image/webp')
              ? canvas.toDataURL(targetType, quality)
              : canvas.toDataURL(targetType);
            resolve(dataUrl);
          } catch (e) {
            reject(e);
          }
        };
        img.onerror = (e) => {
          URL.revokeObjectURL(url);
          reject(e);
        };
        img.src = url;
      });

      submitBtn.disabled = true;
      submitBtn.textContent = 'Processing...';
      
      // Process the registration with our database
      setTimeout(async () => {
        try {
          // Get form data
          const form = backdrop.querySelector('#reg-form');
          const name = form.querySelector('input[name="name"]').value.trim();
          const roll = form.querySelector('input[name="roll"]').value.trim();
          const branch = form.querySelector('input[name="branch"]').value.trim();
          const email = form.querySelector('input[name="email"]')?.value.trim() || null;
          const transactionId = backdrop.querySelector('#transaction-id').value.trim() ||
                                ('UPI' + Math.random().toString(36).substring(2, 10).toUpperCase());

          // Normalize amount to a number
          const amountValue = Number(String(amount ?? '100').replace(/[^\d.]/g, '')) || 100;

          // Ensure database exists
          if (!window.CosmogDB?.Registrations?.create) {
            throw new Error('Database is not initialized');
          }

          // Get file data as base64 for storage (with optional compression)
          let paymentScreenshot = null;
          if (file) {
            const shouldCompress = file.size > 512 * 1024; // >512KB
            paymentScreenshot = shouldCompress
              ? await compressImage(file, 1280, 1280, 0.8)
              : await readAsDataURL(file);
          }

          // Create registration in database
          const created = await window.CosmogDB.Registrations.create({
            name,
            roll_no: roll,
            branch,
            email,
            event_title: eventTitle,
            amount: amountValue,
            transaction_id: transactionId,
            payment_screenshot: paymentScreenshot,
            status: 'confirmed'
          });

          if (!created) {
            throw new Error('Failed to save registration');
          }

          // Update activity feed if it exists on the page
          if (document.querySelector('.activity-feed') && typeof updateActivityFeed === 'function') {
            updateActivityFeed();
          }

          // Show success step with accessibility updates
          backdrop.querySelector('.step-3').classList.remove('active');
          backdrop.querySelector('.step-4').classList.add('active');
          const pane3b = backdrop.querySelector('.step-pane-3');
          const pane4 = backdrop.querySelector('.step-pane-4');
          if (pane3b) { pane3b.style.display = 'none'; pane3b.setAttribute('aria-hidden', 'true'); }
          if (pane4) { pane4.style.display = 'block'; pane4.setAttribute('aria-hidden', 'false'); const first = pane4.querySelector('input, button, a'); if (first) first.focus(); }
          const step3b = backdrop.querySelector('.step-3');
          const step4 = backdrop.querySelector('.step-4');
          if (step3b) step3b.setAttribute('aria-current', 'false');
          if (step4) step4.setAttribute('aria-current', 'step');

          // Set event name and payment details in success message
          const eventNameEl = backdrop.querySelector('#event-name');
          if (eventNameEl) eventNameEl.textContent = eventTitle || 'the event';

          // Add payment confirmation details to success message
          const successMsg = backdrop.querySelector('.step-pane-4 .content');
          if (successMsg) {
            // Clear previous success content if any
            successMsg.textContent = '';
            // Get the latest registration data
            const getLatestRegistration = async () => {
              try {
                if (created && typeof created === 'object') return created;
                if (window.CosmogDB?.Registrations?.findByTransactionId) {
                  const rec = await window.CosmogDB.Registrations.findByTransactionId(transactionId);
                  if (rec) return rec;
                }
                if (window.CosmogDB?.Registrations?.getRecent) {
                  const recentRegistrations = await window.CosmogDB.Registrations.getRecent(1);
                  if (recentRegistrations && recentRegistrations.length > 0) {
                    return recentRegistrations[0];
                  }
                }
                return null;
              } catch (err) {
                console.error('Failed to get registration data:', err);
                return null;
              }
            };

            // Display registration details
            getLatestRegistration().then(registration => {
              const regData = registration || {
                event_title: eventTitle,
                name: form.querySelector('input[name="name"]').value.trim(),
                roll_no: form.querySelector('input[name="roll"]').value.trim(),
                branch: form.querySelector('input[name="branch"]').value.trim(),
                amount: amountValue,
                transaction_id: transactionId,
                created_at: new Date().toISOString(),
                status: 'confirmed'
              };

              // Build details DOM safely
              const paymentDetails = document.createElement('div');
              paymentDetails.className = 'payment-confirmation';

              const titleP = document.createElement('p');
              titleP.innerHTML = '<strong>Payment Details:</strong>';

              const amountP = document.createElement('p');
              amountP.textContent = `Amount: ₹${Number(regData.amount ?? 100)}`;

              const txP = document.createElement('p');
              txP.textContent = `Transaction ID: ${String(regData.transaction_id ?? 'N/A')}`;

              const dateP = document.createElement('p');
              const dt = regData.created_at ? new Date(regData.created_at) : new Date();
              dateP.textContent = `Date: ${dt.toLocaleDateString()}`;

              paymentDetails.append(titleP, amountP, txP, dateP);
              successMsg.appendChild(paymentDetails);

              // Store registration data for receipt generation
              const registrationData = {
                event: regData.event_title,
                name: regData.name,
                roll: regData.roll_no,
                branch: regData.branch,
                amount: `₹${Number(regData.amount ?? 100)}`,
                paymentId: regData.transaction_id,
                timestamp: regData.created_at,
                status: regData.status
              };

              // Enable download receipt button
              const downloadBtn = backdrop.querySelector('#download-receipt');
              if (downloadBtn) {
                downloadBtn.style.display = 'inline-block';
                downloadBtn.onclick = () => generateReceipt(registrationData);
              }
            });
          }

          submitBtn.disabled = false;
          submitBtn.textContent = 'Done';
        } catch (error) {
          console.error('Registration failed:', error);
          alert(error && error.message ? error.message : 'Registration failed. Please try again.');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Registration';
        }
      }, 1500);

    });
  }
  backdrop.querySelector('#reg-title').textContent = `${eventTitle || 'Registration'}`;

  // Reset modal state on open
  const formReset = backdrop.querySelector('#reg-form');
  if (formReset) formReset.reset();
  const successContent = backdrop.querySelector('.step-pane-4 .content');
  if (successContent) successContent.textContent = '';
  const submitBtnInit = backdrop.querySelector('#submit-btn');
  if (submitBtnInit) { submitBtnInit.disabled = false; submitBtnInit.textContent = 'Submit Registration'; }
  const txInputInit = backdrop.querySelector('#transaction-id');
  if (txInputInit) {
    txInputInit.value = '';
    txInputInit.classList.remove('valid','invalid');
    const txWrap = txInputInit.closest('.transaction-id-input');
    txWrap?.classList.remove('valid');
    const err = txWrap?.querySelector('.error-message');
    if (err) err.remove();
  }
  const fileInputInit = backdrop.querySelector('#screenshot-upload');
  if (fileInputInit) fileInputInit.value = '';

  // Reset steps with accessibility
  const panesInit = ['.step-pane-1', '.step-pane-2', '.step-pane-3', '.step-pane-4'];
  panesInit.forEach((sel, i) => {
    const el = backdrop.querySelector(sel);
    if (el) { el.style.display = i === 0 ? 'block' : 'none'; el.setAttribute('aria-hidden', i === 0 ? 'false' : 'true'); }
  });
  const stepsInit = ['.step-1', '.step-2', '.step-3', '.step-4'];
  stepsInit.forEach((sel, i) => {
    const el = backdrop.querySelector(sel);
    if (el) { el.classList.toggle('active', i === 0); el.setAttribute('aria-current', i === 0 ? 'step' : 'false'); }
  });

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

// Generate PDF receipt for registration
function generateReceipt(registrationData) {
  // Create a receipt content string with HTML formatting
  const receiptContent = `
    <html>
    <head>
      <title>Registration Receipt - CoSmoG</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .receipt { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; }
        .header { text-align: center; margin-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .title { font-size: 18px; margin-bottom: 20px; }
        .details { margin-bottom: 20px; }
        .details table { width: 100%; border-collapse: collapse; }
        .details td { padding: 8px; border-bottom: 1px solid #eee; }
        .details td:first-child { font-weight: bold; width: 40%; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <div class="logo">CoSmoG</div>
          <div class="title">Registration Receipt</div>
        </div>
        <div class="details">
          <table>
            <tr>
              <td>Event</td>
              <td>${registrationData.event || 'N/A'}</td>
            </tr>
            <tr>
              <td>Name</td>
              <td>${registrationData.name || 'N/A'}</td>
            </tr>
            <tr>
              <td>Roll Number</td>
              <td>${registrationData.roll || 'N/A'}</td>
            </tr>
            <tr>
              <td>Branch</td>
              <td>${registrationData.branch || 'N/A'}</td>
            </tr>
            <tr>
              <td>Amount Paid</td>
              <td>${registrationData.amount || '₹0'}</td>
            </tr>
            <tr>
              <td>Transaction ID</td>
              <td>${registrationData.paymentId || 'N/A'}</td>
            </tr>
            <tr>
              <td>Date & Time</td>
              <td>${new Date(registrationData.timestamp).toLocaleString()}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>${registrationData.status === 'confirmed' ? 'Confirmed ✓' : registrationData.status}</td>
            </tr>
          </table>
        </div>
        <div class="footer">
          <p>This is an electronic receipt for your registration. Please bring this receipt or your registration ID to the event.</p>
          <p>For any queries, contact us at: support@cosmog.edu</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Create a Blob from the HTML content
  const blob = new Blob([receiptContent], { type: 'text/html' });
  
  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link element
  const link = document.createElement('a');
  link.href = url;
  const safe = (s) => String(s || 'N_A').replace(/[^A-Za-z0-9_.-]+/g, '_');
  link.download = `CoSmoG_Receipt_${safe(registrationData.event)}_${safe(registrationData.name)}.html`;
  
  // Append to the document, click it, and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Release the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100);
}


