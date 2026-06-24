// ===== INLINE BOOKING FLOW =====
// Replaces the "book via chat assistant" handoff with a real multi-step flow
// directly on the artist profile: date (already selected via calendar) ->
// function type -> contact info -> confirmation. STATE.bookingDraft carries
// the in-progress booking across steps.

const FUNCTION_TYPES = [
  { id: 'mehendi', label: 'Mehendi', note: 'Daytime, natural finish' },
  { id: 'sangeet', label: 'Sangeet', note: 'Evening, dance-floor ready' },
  { id: 'wedding', label: 'Wedding Day', note: 'Full bridal, all-day wear' },
  { id: 'reception', label: 'Reception', note: 'Evening glam, photo-ready' }
];

function initBookingDraft(artistId) {
  STATE.bookingDraft = {
    artistId,
    date: null,
    dateStatus: null,
    functionType: null,
    name: '',
    phone: '',
    email: '',
    step: 'date' // date -> function -> contact -> confirmed
  };
}

// Called by the existing calendar once a date resolves to "open" (directly or
// via the waitlist alternative-finder). Advances the booking flow to step 2.
function confirmBookingDate(artistId, date) {
  if (!STATE.bookingDraft || STATE.bookingDraft.artistId !== artistId) {
    initBookingDraft(artistId);
  }
  STATE.bookingDraft.date = date;
  STATE.bookingDraft.dateStatus = 'open';
  STATE.bookingDraft.step = 'function';
  renderBookingPanel(artistId);
}

function renderBookingPanel(artistId) {
  const panel = document.getElementById('booking-panel');
  if (!panel) return;
  const draft = STATE.bookingDraft;
  if (!draft || draft.step === 'date') {
    panel.innerHTML = '';
    return;
  }

  if (draft.step === 'function') {
    panel.innerHTML = renderFunctionStep(draft);
  } else if (draft.step === 'contact') {
    panel.innerHTML = renderContactStep(draft);
  } else if (draft.step === 'confirmed') {
    panel.innerHTML = renderConfirmedStep(draft);
  }
}

function renderFunctionStep(draft) {
  return `
  <div class="bk-step">
    <div class="bk-step-head">
      <span class="bk-step-label">Step 2 of 3</span>
      <span class="bk-selected-date">${formatDate(draft.date)}</span>
    </div>
    <div class="bk-step-title">What's the function?</div>
    <div class="bk-function-grid">
      ${FUNCTION_TYPES.map(f => `
        <button class="bk-function-btn ${draft.functionType === f.id ? 'bk-active' : ''}" onclick="selectFunctionType('${f.id}')">
          <span class="bk-fn-label">${f.label}</span>
          <span class="bk-fn-note">${f.note}</span>
        </button>
      `).join('')}
    </div>
    <button class="bk-back" onclick="bookingGoBack('date')">← Change date</button>
  </div>`;
}

function selectFunctionType(typeId) {
  STATE.bookingDraft.functionType = typeId;
  STATE.bookingDraft.step = 'contact';
  renderBookingPanel(STATE.bookingDraft.artistId);
}

function renderContactStep(draft) {
  const fn = FUNCTION_TYPES.find(f => f.id === draft.functionType);
  return `
  <div class="bk-step">
    <div class="bk-step-head">
      <span class="bk-step-label">Step 3 of 3</span>
      <span class="bk-selected-date">${formatDate(draft.date)} · ${fn ? fn.label : ''}</span>
    </div>
    <div class="bk-step-title">Your contact details</div>
    <div class="bk-form">
      <label class="bk-field-label">Full name</label>
      <input type="text" id="bkName" class="bk-input" placeholder="e.g. Ananya Sharma" value="${draft.name}">
      <label class="bk-field-label">Phone number</label>
      <input type="tel" id="bkPhone" class="bk-input" placeholder="e.g. 98765 43210" value="${draft.phone}">
      <label class="bk-field-label">Email <span style="opacity:0.5; font-weight:400;">(optional)</span></label>
      <input type="email" id="bkEmail" class="bk-input" placeholder="e.g. ananya@email.com" value="${draft.email}">
    </div>
    <div id="bkFormError" class="bk-error"></div>
    <button class="bk-confirm-btn" onclick="submitBookingContact()">Confirm booking request</button>
    <button class="bk-back" onclick="bookingGoBack('function')">← Change function</button>
  </div>`;
}

function submitBookingContact() {
  const name = document.getElementById('bkName').value.trim();
  const phone = document.getElementById('bkPhone').value.trim();
  const email = document.getElementById('bkEmail').value.trim();
  const errorEl = document.getElementById('bkFormError');

  if (!name) { errorEl.textContent = 'Please enter your name.'; return; }
  const phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.length < 10) { errorEl.textContent = 'Please enter a valid 10-digit phone number.'; return; }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errorEl.textContent = 'That email looks incomplete — check it and try again.'; return; }

  errorEl.textContent = '';
  STATE.bookingDraft.name = name;
  STATE.bookingDraft.phone = phone;
  STATE.bookingDraft.email = email;
  STATE.bookingDraft.step = 'confirmed';
  renderBookingPanel(STATE.bookingDraft.artistId);
}

function renderConfirmedStep(draft) {
  const fn = FUNCTION_TYPES.find(f => f.id === draft.functionType);
  const artist = ARTISTS.find(a => a.id === draft.artistId);
  return `
  <div class="bk-step bk-confirmed">
    <div class="bk-confirmed-icon">✓</div>
    <div class="bk-step-title" style="text-align:center;">Booking request sent</div>
    <p class="bk-confirmed-sub">${artist.name} will confirm availability and reach out shortly.</p>
    <div class="bk-summary">
      <div class="bk-summary-row"><span>Date</span><strong>${formatDate(draft.date)}</strong></div>
      <div class="bk-summary-row"><span>Function</span><strong>${fn ? fn.label : '—'}</strong></div>
      <div class="bk-summary-row"><span>Name</span><strong>${draft.name}</strong></div>
      <div class="bk-summary-row"><span>Phone</span><strong>${draft.phone}</strong></div>
      ${draft.email ? `<div class="bk-summary-row"><span>Email</span><strong>${draft.email}</strong></div>` : ''}
    </div>
    <p class="bk-confirmed-note">No payment has been taken. This is a request — final price and availability are confirmed directly with the artist.</p>
    <button class="bk-back" style="margin-top:14px;" onclick="bookingGoBack('date')">Make another request</button>
  </div>`;
}

function bookingGoBack(step) {
  if (!STATE.bookingDraft) return;
  if (step === 'date') {
    STATE.bookingDraft.step = 'date';
    renderBookingPanel(STATE.bookingDraft.artistId);
    const schedEl = document.getElementById('scheduling-assist');
    if (schedEl) schedEl.innerHTML = '';
  } else {
    STATE.bookingDraft.step = step;
    renderBookingPanel(STATE.bookingDraft.artistId);
  }
}
