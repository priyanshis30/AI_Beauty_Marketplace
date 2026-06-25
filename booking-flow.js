// ===== INLINE BOOKING FLOW =====
// Replaces the "book via chat assistant" handoff with a real multi-step flow
// directly on the artist profile: date (already selected via calendar) ->
// function type -> contact info -> confirmation. STATE.bookingDraft carries
// the in-progress booking across steps.
 
// ===== GOOGLE FORMS INTEGRATION =====
// Booking requests submit to this Google Form so they land in a real spreadsheet
// instead of disappearing when the browser tab closes.
//
// HOW TO FINISH WIRING THIS UP:
// 1. In the live Google Form, click the ⋮ menu → "Get pre-filled link"
// 2. Fill every field with placeholder text, click "Get Link", copy it
// 3. That link contains entry.XXXXXXX=... for each field — copy each number below
// 4. Replace the formActionUrl with the same base URL but ending in /formResponse
//    instead of /viewform (swap "viewform" for "formResponse" in the URL)
const GOOGLE_FORM_CONFIG = {
  // base form URL — replace the viewform link's ID portion if it ever changes
  formActionUrl: "https://docs.google.com/forms/d/e/1FAIpQLSd2cSOjZ_FoTwcJ7Dh0YPGRn0JwZXMlThnbzpLEdyJkfWDcQw/formResponse",
  // PLACEHOLDER IDs — replace each with the real entry.XXXXXXX number from your
  // pre-filled link before this goes live. Submission is silently skipped (with
  // a console warning) as long as any of these still say "REPLACE_ME".
  fields: {
    salonName: "entry.REPLACE_ME_1",
    date: "entry.REPLACE_ME_2",
    functionType: "entry.REPLACE_ME_3",
    fullName: "entry.REPLACE_ME_4",
    phone: "entry.REPLACE_ME_5",
    email: "entry.REPLACE_ME_6"
  }
};
 
function isGoogleFormConfigured() {
  return Object.values(GOOGLE_FORM_CONFIG.fields).every(v => !v.includes("REPLACE_ME"));
}
 
// Submits via a hidden iframe + form POST — Google Forms' submission endpoint
// doesn't return CORS headers, so a normal fetch() can't read the response, but
// the POST still goes through and the response lands in the sheet regardless.
// This fire-and-forget pattern is the standard approach for posting to Forms
// from a page that isn't itself served by Google.
function submitToGoogleForm(draft, artistName) {
  if (!isGoogleFormConfigured()) {
    console.warn("Google Form not yet configured — booking was not submitted externally. See GOOGLE_FORM_CONFIG in booking-flow.js.");
    return;
  }
 
  const fn = FUNCTION_TYPES.find(f => f.id === draft.functionType);
  const values = {
    [GOOGLE_FORM_CONFIG.fields.salonName]: artistName,
    [GOOGLE_FORM_CONFIG.fields.date]: formatDate(draft.date),
    [GOOGLE_FORM_CONFIG.fields.functionType]: fn ? fn.label : draft.functionType,
    [GOOGLE_FORM_CONFIG.fields.fullName]: draft.name,
    [GOOGLE_FORM_CONFIG.fields.phone]: draft.phone,
    [GOOGLE_FORM_CONFIG.fields.email]: draft.email || ""
  };
 
  let iframe = document.getElementById('gform-submit-frame');
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'gform-submit-frame';
    iframe.name = 'gform-submit-frame';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  }
 
  const form = document.createElement('form');
  form.action = GOOGLE_FORM_CONFIG.formActionUrl;
  form.method = 'POST';
  form.target = 'gform-submit-frame';
 
  Object.entries(values).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });
 
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}
 
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
 
  const artist = ARTISTS.find(a => a.id === STATE.bookingDraft.artistId);
  submitToGoogleForm(STATE.bookingDraft, artist ? artist.name : '');
 
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
 
