// ===== GLOBAL FLOATING CHAT WIDGET =====
// Replaces the full-page "Booking Assistant" view with a persistent bottom-right
// bubble that opens a chat panel from any page. Reuses chatBubble(), extractStylesFromText(),
// and the booking-query logic already defined in views.js.

let WIDGET_OPEN = false;
let WIDGET_GREETED = false; // becomes true once the person opens the widget for the first time

function renderChatWidget() {
  const container = document.getElementById('chatWidgetRoot');
  if (!container) return;

  if (STATE.chatMessages.length === 0) {
    STATE.chatMessages.push({
      from: 'bot',
      text: "Hey! I'm Sundari, your booking assistant ✨ Tell me what you need — function type, date, area, and budget if you have one. e.g. \"Bridal makeup for July 12th in South Delhi, budget around 20k\""
    });
  }

  container.innerHTML = `
    <div class="cw-panel ${WIDGET_OPEN ? 'cw-open' : ''}" id="cwPanel">
      <div class="cw-header">
        <img src="${sundariUri(80)}" class="cw-avatar" alt="Sundari">
        <div>
          <div class="cw-header-title">Sundari</div>
          <div class="cw-header-sub">Your booking assistant · usually replies instantly</div>
        </div>
        <button class="cw-close" onclick="toggleChatWidget(false)" aria-label="Close chat">✕</button>
      </div>
      <div class="cw-window" id="cwWindow">
        ${STATE.chatMessages.map(chatBubble).join('')}
      </div>
      <div class="cw-input-row">
        <input id="cwInput" type="text" placeholder="Type your booking request..." onkeydown="if(event.key==='Enter') sendWidgetChat()">
        <button onclick="sendWidgetChat()" aria-label="Send">➤</button>
      </div>
    </div>

    <div class="cw-launcher ${WIDGET_OPEN ? 'cw-launcher-hide' : ''}" id="cwLauncher">
      ${!WIDGET_GREETED ? `
      <div class="cw-greet-bubble" onclick="toggleChatWidget(true)">
        <span class="cw-greet-name">Hey! I'm Sundari</span>
        <span class="cw-greet-sub">your booking assistant ✨</span>
      </div>` : ''}
      <button class="cw-bubble" id="cwBubble" onclick="toggleChatWidget(true)" aria-label="Open booking assistant">
        <img src="${sundariUri(80)}" class="cw-bubble-doodle" alt="Sundari, your booking assistant">
        <span class="cw-bubble-pulse"></span>
      </button>
    </div>
  `;

  const win = document.getElementById('cwWindow');
  if (win) win.scrollTop = win.scrollHeight;
}

function toggleChatWidget(open) {
  WIDGET_OPEN = open;
  if (open) WIDGET_GREETED = true;
  renderChatWidget();
  if (open) {
    setTimeout(() => {
      const input = document.getElementById('cwInput');
      if (input) input.focus();
    }, 250);
  }
}

function sendWidgetChat() {
  const input = document.getElementById('cwInput');
  const text = input.value.trim();
  if (!text) return;
  STATE.chatMessages.push({ from: 'user', text });
  input.value = '';
  rerenderWidgetWindow();

  setTimeout(() => {
    const reply = processBookingQueryWidget(text);
    STATE.chatMessages.push({ from: 'bot', text: reply });
    rerenderWidgetWindow();
  }, 700);
}

function rerenderWidgetWindow() {
  const win = document.getElementById('cwWindow');
  if (win) {
    win.innerHTML = STATE.chatMessages.map(chatBubble).join('');
    win.scrollTop = win.scrollHeight;
  }
}

// Quick-reply patterns for small talk, checked before any salon matching happens.
// Each pattern maps to a fixed reply so "hi" never falls through to the unfiltered
// artist pool (which is what was causing random top-rated salons to show up).
const SMALL_TALK = [
  { pattern: /^(hi|hello|hey|hii+|helo|yo|sup)[\s!.]*$/i,
    reply: "Hey there! 👋 I can help you find and book a bridal artist. Tell me a bit about what you need — for example, the area, date, function (mehendi/sangeet/wedding/reception), or your budget." },
  { pattern: /^(thanks|thank you|thx|ty|tysm)[\s!.]*$/i,
    reply: "You're welcome! Let me know if you'd like help finding or booking another artist. 💛" },
  { pattern: /^(bye|goodbye|see ya|cya)[\s!.]*$/i,
    reply: "Bye! Come back anytime you're ready to book. 👋" },
  { pattern: /(who are you|what can you do|what do you do)/i,
    reply: "I'm Sundari, your booking assistant! I help match you with bridal artists based on area, budget, function, or style — just tell me what you're looking for, like \"soft glam in Gurugram under 20k\"." },
  { pattern: /\bhelp\b/i,
    reply: "I'm Sundari, your booking assistant! I help match you with bridal artists based on area, budget, function, or style — just tell me what you're looking for, like \"soft glam in Gurugram under 20k\"." },
  { pattern: /^(how are you|what'?s up)[\s?!.]*$/i,
    reply: "Doing great, thanks for asking! Ready to help whenever you want to find a bridal artist. 😊" }
];

function matchSmallTalk(text) {
  const trimmed = text.trim();
  for (const { pattern, reply } of SMALL_TALK) {
    if (pattern.test(trimmed)) return reply;
  }
  return null;
}

// Fallback-free style detector used only for the widget's intent check below.
// extractStylesFromText() (defined in views.js, used by the AI look-matcher) always
// returns at least 2 styles by design — that's correct for the matcher, which should
// never show zero results, but it silently defeated the "no real signal" check here,
// since gibberish input would still resolve to a non-empty styles array.
function detectStylesStrict(text) {
  const lower = text.toLowerCase();
  const matched = new Set();
  Object.keys(LOOK_KEYWORDS).forEach(kw => {
    if (lower.includes(kw)) LOOK_KEYWORDS[kw].forEach(s => matched.add(s));
  });
  return Array.from(matched);
}

// Same matching logic as processBookingQuery, but appends result cards into the
// widget's window (#cwWindow) instead of the old full-page #chatWindow, and closes
// over navigation so tapping an artist also closes the widget for a clean transition.
function processBookingQueryWidget(text) {
  // Step 1: greetings/small talk get a fixed conversational reply, never salon results.
  const smallTalkReply = matchSmallTalk(text);
  if (smallTalkReply) return smallTalkReply;

  const lower = text.toLowerCase();
  const area = AREAS.find(a => lower.includes(a.toLowerCase()));

  let budget = null;
  const kMatch = lower.match(/(\d+)\s*k/);
  const numMatch = lower.match(/(\d{4,6})/);
  if (kMatch) budget = parseInt(kMatch[1]) * 1000;
  else if (numMatch) budget = parseInt(numMatch[1]);

  const strictStyles = detectStylesStrict(text);
  const hasFunctionWord = /\b(mehendi|sangeet|wedding|reception|bridal|cocktail)\b/i.test(text);

  // Step 2: if the message gives literally no usable signal (no area, budget,
  // recognized style, or function word), ask a clarifying question instead of
  // silently returning the top-rated salons across the entire roster.
  if (!area && !budget && strictStyles.length === 0 && !hasFunctionWord) {
    return "I didn't quite catch what you're looking for — could you tell me the area, your budget, or the function (like mehendi, sangeet, or wedding day)? For example: \"bridal makeup in South Delhi under 20k\".";
  }

  // For actual filtering, fall back to the matcher's style detection (which
  // defaults to popular styles) only once we know real intent exists — this
  // keeps "mehendi this weekend" useful even though it names no specific style.
  const styles = strictStyles.length > 0 ? strictStyles : extractStylesFromText(text);

  let pool = ARTISTS;
  if (area) pool = pool.filter(a => a.area === area);
  if (budget) pool = pool.filter(a => a.priceFrom <= budget * 1.15);
  if (strictStyles.length > 0) pool = pool.filter(a => a.styles.some(s => strictStyles.includes(s)));

  if (pool.length === 0) {
    return `I couldn't find an exact match${area ? ` in ${area}` : ''}${budget ? ` under ₹${budget.toLocaleString('en-IN')}` : ''}. Want me to widen the search to nearby areas, or adjust the budget?`;
  }

  const top = pool.sort((a, b) => b.rating - a.rating).slice(0, 3);

  let intro = "Here's what I found";
  if (area) intro += ` in ${area}`;
  if (budget) intro += `, within ₹${budget.toLocaleString('en-IN')}`;
  intro += ":";

  setTimeout(() => {
    const win = document.getElementById('cwWindow');
    if (win) {
      const cardsHtml = `
        <div style="display:flex; flex-direction:column; gap:8px; margin-top:2px;">
          ${top.map(a => `
            <div onclick="openArtistFromWidget('${a.id}')" style="cursor:pointer; display:flex; gap:10px; padding:9px; background:white; border:1px solid var(--line); border-radius:12px; align-items:center;">
              <img src="${a.photo}" style="width:40px; height:40px; border-radius:8px; object-fit:cover; flex-shrink:0;" alt="">
              <div style="flex:1; min-width:0;">
                <div style="font-weight:600; font-size:12.5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${a.name}</div>
                <div style="font-size:10.5px; opacity:0.6;">${a.area} · ★${a.rating} · ₹${a.priceFrom.toLocaleString('en-IN')}</div>
              </div>
              <span style="font-size:10.5px; color:var(--rani); font-weight:600; flex-shrink:0;">View →</span>
            </div>
          `).join('')}
        </div>`;
      win.insertAdjacentHTML('beforeend', cardsHtml);
      win.scrollTop = win.scrollHeight;
    }
  }, 50);

  return intro + " (tap any artist below)";
}

function openArtistFromWidget(id) {
  toggleChatWidget(false);
  openArtist(id);
}

document.addEventListener('DOMContentLoaded', renderChatWidget);
if (document.readyState !== 'loading') renderChatWidget();
