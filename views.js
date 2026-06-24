// ===== VIEW RENDERERS =====

function renderHome() {
  return `
  <section class="hero">
    <div class="hero-grain"></div>
    <div class="hero-inner">
      <div>
        <div class="hero-eyebrow">Delhi NCR · Bridal Beauty Booking</div>
        <h1>The artist who already<br>understands <em>your</em> look —<br>not a stranger you're hoping<br>gets it right.</h1>
        <p class="hero-sub">Describe the bridal look you want, or show us a reference. Our matching engine reads it against real portfolios — then helps you book the date before someone else does.</p>
        <div class="hero-actions">
          <button class="btn-primary" onclick="navigate('matcher')">✨ Find my look match</button>
          <button class="btn-secondary-dark" onclick="navigate('browse')">Browse all artists</button>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-collage">
          <img class="hc-1" src="${portraitDataUri('hero-1', 'Heavy Kumkum', 700)}" alt="Illustrated traditional bridal style">
          <img class="hc-2" src="${portraitDataUri('hero-2', 'Soft Glam', 500)}" alt="Illustrated soft glam bridal style">
          <div class="hero-tag-float"><span class="pulse"></span> 3 artists open this weekend in South Delhi</div>
        </div>
      </div>
    </div>
  </section>

  <section class="section-pad" style="padding-top:88px;">
    <div class="section-head">
      <h2>Featured this <span class="italic-note" style="font-style:italic;">season</span></h2>
      <span class="section-count">Picked for wedding-season demand</span>
    </div>
    <div class="artist-grid">
      ${ARTISTS.slice(0, 4).map(a => artistCard(a)).join('')}
    </div>
  </section>

  ${howItWorksSection()}
  `;
}

function howItWorksSection() {
  return `
  <section class="section-pad" style="padding-top:8px;">
    <div class="section-head"><h2>How booking works</h2></div>
    <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:24px;">
      ${[
        { t: "Describe your look", d: "Type what you want or pick a reference image — no need to know the technical terms." },
        { t: "Get matched", d: "AI compares your look to real artist portfolios and ranks the closest fits near you." },
        { t: "Chat to book", d: "Tell our assistant your date, budget and function — it finds open slots instantly." },
        { t: "Confirmed, no surprises", d: "If your slot fills up, we suggest real alternatives before you lose the date." }
      ].map((s, i) => `
        <div style="padding:24px; background:white; border:1px solid var(--line); border-radius:16px;">
          <div class="mono" style="font-size:12px; color:var(--gold); font-weight:600; margin-bottom:10px;">0${i+1}</div>
          <h3 style="font-size:17px; margin-bottom:8px;">${s.t}</h3>
          <p style="font-size:14px; opacity:0.65;">${s.d}</p>
        </div>
      `).join('')}
    </div>
  </section>
  `;
}

function artistCard(a, matchScore) {
  const isFav = STATE.favorites.has(a.id);
  return `
  <div class="artist-card" onclick="openArtist('${a.id}')">
    <div class="artist-photo">
      <img src="${a.photo}" alt="${a.name} portfolio sample" loading="lazy">
      ${matchScore ? `<div class="artist-badge match">${matchScore}% match</div>` : `<div class="artist-badge">★ ${a.rating}</div>`}
      <button class="artist-fav" onclick="event.stopPropagation(); toggleFav('${a.id}')" aria-label="Save artist">${isFav ? '♥' : '♡'}</button>
      <div class="artist-name-overlay">
        <div class="name">${a.name}</div>
        <div class="area">${a.area} · ${a.experience} yrs</div>
      </div>
    </div>
    <div class="artist-info">
      <div class="artist-tags">
        ${a.styles.slice(0,3).map(s => `<span class="tag">${s}</span>`).join('')}
      </div>
      <div class="artist-price-row">
        <div class="artist-price">₹${a.priceFrom.toLocaleString('en-IN')}<span> onwards</span></div>
        <span class="view-btn">View profile →</span>
      </div>
    </div>
  </div>
  `;
}

function renderBrowse() {
  const filtered = applyFilters(ARTISTS);
  return `
  <section style="padding:40px 32px 0; max-width:1200px; margin:0 auto;">
    <div class="eyebrow-light">Browse</div>
    <h1 style="font-size:36px; margin-bottom:8px;">Delhi bridal artists & studios</h1>
    <p style="opacity:0.65; font-size:15px; margin-bottom:8px;">${filtered.length} artists match your filters</p>
  </section>
  <section class="filter-section">
    <div class="filter-group">
      <div class="filter-label">Region</div>
      <div class="filter-row">
        ${chip('area', 'All Areas')}
        ${AREAS.map(ar => chip('area', ar)).join('')}
      </div>
    </div>
    <div class="filter-group">
      <div class="filter-label">Expertise</div>
      <div class="filter-row">
        ${chip('style', 'All Styles')}
        ${STYLE_TAGS.map(s => chip('style', s)).join('')}
      </div>
    </div>
  </section>
  <section class="section-pad" style="padding-top:0;">
    ${filtered.length ? `<div class="artist-grid">${filtered.map(a => artistCard(a)).join('')}</div>` :
      `<div style="text-align:center; padding:60px 0; opacity:0.6;">No artists match these filters yet. Try widening your search.</div>`}
  </section>
  `;
}

function chip(type, value) {
  const active = STATE.filters[type] === value;
  return `<button class="chip ${active ? 'active' : ''}" onclick="setFilter('${type}', '${value}')">${value}</button>`;
}

function applyFilters(list) {
  return list.filter(a => {
    const areaOk = STATE.filters.area === 'All Areas' || a.area === STATE.filters.area;
    const styleOk = STATE.filters.style === 'All Styles' || a.styles.includes(STATE.filters.style);
    return areaOk && styleOk;
  });
}

function setFilter(type, value) {
  STATE.filters[type] = value;
  render();
}

function toggleFav(id) {
  if (STATE.favorites.has(id)) STATE.favorites.delete(id);
  else STATE.favorites.add(id);
  render();
}

function openArtist(id) {
  STATE.selectedArtist = id;
  initBookingDraft(id);
  navigate('artist');
}

// AI-generated profile bio (mocked LLM call — in production this would be a real API call
// using artist-submitted raw notes, expanded into polished bridal-industry copy)
function generateBio(artist) {
  const templates = {
    a1: "Meher's philosophy is simple: if people notice the makeup before they notice the bride, something went wrong. Trained in Paris and refined in Delhi's bridal scene, she is known for luminous skin, seamless blending, and looks that feel elevated rather than obvious. Her brides often describe the experience as looking like themselves—just on their best day.",
    a2: "Rangrez Bridal Atelier approaches bridal makeup the way a family heirloom is crafted: patiently, traditionally, and with an obsession for detail. Their signature heavy-kumkum looks have become a fixture at grand North Indian weddings, combining rich colors with techniques designed to last from the first ritual to the final farewell.",
    a3: "Anaya built Glow Theory around a question most artists ignore: how does bridal makeup actually look under changing lights? Years of perfecting HD airbrush techniques have made her a favorite for cocktails, receptions, and evening events where cameras, LEDs, and dance floors can expose every flaw. Her work stays flawless long after sunset.",
    a4: "Long before bridal makeup became an Instagram trend, The Sindoor House was helping Delhi brides prepare for their wedding day. Three generations later, the salon remains known for timeless traditional artistry, bold bridal details, and an unwavering commitment to preserving the elegance of classic Indian bridal beauty.",
    a5: "Petal & Pearl believes great bridal makeup should be accessible, not exclusive. Their soft-glam aesthetic focuses on fresh skin, romantic tones, and lightweight finishes that feel comfortable through long celebrations. Brides love them for delivering a polished luxury look without the luxury price tag.",
    a6: "Wedding celebrations rarely fit into one style anymore—and neither do Zoya's brides. Known for blending traditional glamour with contemporary trends, she creates looks that transition effortlessly between ceremonies, receptions, and destination events. Her portfolio is built on versatility without compromise.",
    a7: "Henna & Highlights has carved out a niche by perfecting the understated elegance many brides want for intimate functions. Their makeup complements rather than competes with the occasion, making them especially popular for mehendi celebrations, daytime ceremonies, and natural bridal looks.",
    a8: "Maison Mehera operates at the level where bridal beauty meets editorial fashion. Trusted by high-profile clients and luxury wedding planners, the team combines advanced airbrush techniques with impeccable attention to detail. The result is makeup that remains camera-ready across thousands of photographs and hours of celebration.",
    a9: "Ivory & Vermilion specializes in the art of restraint. Their signature looks are soft, romantic, and thoughtfully balanced, enhancing natural features without overwhelming them. Brides seeking elegance over excess often find exactly what they're looking for here.",
    a10: "Naina Studio has earned its reputation through consistency. Year after year, brides across West Delhi return for traditional bridal looks that deliver exactly what was promised—rich colors, reliable service, and makeup designed to stay flawless through every ceremony and photograph.",
    a11: "Saffron Bride Co. thrives in the moments when celebrations become memories. Their pastel-toned soft-glam looks are especially popular for receptions and sangeets, where movement, lighting, and photography demand makeup that feels effortless while still making an impression.",
    a12: "Kohl & Kalash embraces the drama and grandeur of Indian weddings. Their bold bridal aesthetic is designed for large venues, bright stage lights, and unforgettable entrances. Every look is crafted to command attention while maintaining the precision needed for close-up photography.",
    a13: "Aaina Bridal Lounge caters to brides who believe sophistication speaks softly. Their minimalist approach focuses on flawless skin, refined detailing, and subtle enhancement rather than dramatic transformation. The result is bridal beauty that feels modern, luxurious, and timeless.",
    a14: "Roohani Makeovers is known for creating bridal looks that feel larger than life without losing elegance. Combining bold artistry with advanced airbrush techniques, the team consistently delivers the kind of polished, high-impact finish often seen in fashion and bridal editorials.",
    a15: "Champa Studio proves creativity matters more than budget. Known for fresh pastel palettes and modern fusion looks, the team has built a loyal following through skill, word-of-mouth recommendations, and an ability to make every bride feel uniquely celebrated.",
    a16: "For nearly two decades, Mehfil Bridal House has been synonymous with traditional bridal glamour in Dwarka. Their expertise lies in creating rich, ceremonial looks that honor cultural traditions while maintaining the polish expected by today's brides. It's the kind of trusted name families recommend generation after generation."
  };
  return templates[artist.id] || artist.tagline;
}

function renderArtistProfile() {
  const a = ARTISTS.find(x => x.id === STATE.selectedArtist);
  if (!a) return renderBrowse();
  const bio = generateBio(a);
  const isFav = STATE.favorites.has(a.id);

  return `
  <section style="max-width:1140px; margin:0 auto; padding:28px 32px 0;">
    <button class="btn-secondary" style="padding:9px 18px; font-size:13px;" onclick="navigate('browse')">← Back to artists</button>
  </section>

  <section style="max-width:1140px; margin:0 auto; padding:24px 32px 90px; display:grid; grid-template-columns: 1.15fr 0.85fr; gap:52px;">
    <div>
      <div style="display:grid; grid-template-columns:1.4fr 1fr; gap:12px; margin-bottom:32px;">
        <img src="${a.portfolio[0]}" style="width:100%; height:420px; object-fit:cover; border-radius:6px;" alt="${a.name} portfolio">
        <div style="display:flex; flex-direction:column; gap:12px;">
          <img src="${a.portfolio[1]}" style="width:100%; height:204px; object-fit:cover; border-radius:6px;" alt="">
          <img src="${a.portfolio[2]}" style="width:100%; height:204px; object-fit:cover; border-radius:6px;" alt="">
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
        <h1 style="font-size:36px; font-style:italic; font-weight:480;">${a.name}</h1>
        <button class="btn-secondary" style="padding:9px 16px; font-size:13px; flex-shrink:0; margin-left:16px;" onclick="toggleFav('${a.id}')">${isFav ? '♥ Saved' : '♡ Save'}</button>
      </div>
      <div style="opacity:0.6; font-size:14px; margin-bottom:20px;">${a.area} · ★ ${a.rating} (${a.reviews} reviews) · ${a.experience} yrs experience</div>

      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:28px;">
        ${a.styles.map(s => `<span class="tag" style="background:var(--blush); opacity:1;">${s}</span>`).join('')}
      </div>

      <div style="background:white; border:1px solid var(--line); border-radius:14px; padding:24px; margin-bottom:28px; position:relative; overflow:hidden;">
        <div style="position:absolute; top:0; left:0; width:3px; height:100%; background:linear-gradient(180deg, var(--gold), var(--rani));"></div>
        <p style="font-size:15.5px; line-height:1.7; opacity:0.82;">${bio}</p>
      </div>

      <h3 style="font-size:19px; margin-bottom:14px; font-style:italic;">Portfolio</h3>
      <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px;">
        ${a.portfolio.map(p => `<img src="${p}" style="width:100%; height:150px; object-fit:cover; border-radius:6px; transition:transform 0.3s;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'" alt="">`).join('')}
      </div>
    </div>

    <div>
      <div style="background:white; border:1px solid var(--line); border-radius:20px; padding:26px; position:sticky; top:96px; box-shadow:var(--shadow);">
        <div style="font-size:13.5px; opacity:0.55; margin-bottom:3px;">Starting from</div>
        <div style="font-family:'Fraunces',serif; font-size:32px; color:var(--rani); margin-bottom:22px; font-weight:480;">₹${a.priceFrom.toLocaleString('en-IN')}</div>

        <div id="bk-date-section">
          <div style="font-size:12.5px; font-weight:700; margin-bottom:12px; display:flex; align-items:center; gap:6px; text-transform:uppercase; letter-spacing:0.04em; opacity:0.7;">
            Pick a date — July 2026
          </div>
          ${renderMiniCalendar(a.id)}
          <div id="scheduling-assist" style="margin-top:16px;"></div>
        </div>

        <div id="booking-panel"></div>

        <p style="font-size:11.5px; opacity:0.45; text-align:center; margin-top:14px;">No payment is taken — this sends a booking request directly to the artist.</p>
      </div>
    </div>
  </section>
  `;
}

function renderMiniCalendar(artistId) {
  const avail = AVAILABILITY[artistId];
  const dates = Object.keys(avail).slice(0, 14);
  return `
  <div style="display:grid; grid-template-columns:repeat(7,1fr); gap:5px;">
    ${dates.map(d => {
      const status = avail[d];
      const day = parseInt(d.split('-')[2]);
      const color = status === 'full' ? '#D8D2C8' : status === 'limited' ? 'var(--gold-soft)' : 'var(--mehendi)';
      const textColor = status === 'full' ? '#9B9488' : status === 'limited' ? '#7A5F1E' : 'white';
      const clickable = status !== 'full';
      return `<button
        ${clickable ? `onclick="selectDate('${artistId}','${d}','${status}')"` : 'disabled'}
        style="aspect-ratio:1; border-radius:8px; background:${color}; color:${textColor}; font-size:13px; font-weight:600; cursor:${clickable ? 'pointer' : 'not-allowed'}; opacity:${status==='full' ? '0.5':'1'};"
        title="${status === 'full' ? 'Fully booked' : status === 'limited' ? 'Limited slots' : 'Open'}"
      >${day}</button>`;
    }).join('')}
  </div>
  <div style="display:flex; gap:14px; margin-top:10px; font-size:11px; opacity:0.6;">
    <span>🟩 Open</span><span>🟨 Limited</span><span>⬜ Full</span>
  </div>
  `;
}

// Smart scheduling/waitlist feature: when a full date is attempted or a limited
// date is picked, AI suggests real nearby alternatives ranked by proximity to
// the requested date and the artist's actual availability pattern.
function selectDate(artistId, date, status) {
  const el = document.getElementById('scheduling-assist');
  if (!el) return;

  if (status === 'open') {
    el.innerHTML = `
      <div style="background:var(--ivory-deep); border-radius:10px; padding:14px; font-size:13px;">
        <strong>${formatDate(date)}</strong> is open. ✅
      </div>`;
    confirmBookingDate(artistId, date);
    return;
  }

  // status === 'limited' — trigger the AI alternative-finder
  el.innerHTML = `<div style="font-size:13px; opacity:0.6; padding:10px;">Checking nearby availability…</div>`;
  setTimeout(() => {
    const alternatives = findNearbyAlternatives(artistId, date);
    el.innerHTML = `
      <div style="background:var(--ivory-deep); border-radius:10px; padding:14px;">
        <div style="font-size:13px; margin-bottom:8px;"><strong>${formatDate(date)}</strong> has limited slots left — only 1-2 booking windows remain.</div>
        <div class="mono" style="font-size:10px; color:var(--gold); font-weight:600; text-transform:uppercase; margin-bottom:6px;">AI suggests nearby dates with full availability</div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          ${alternatives.map(alt => `<button class="chip" style="background:white;" onclick="selectDate('${artistId}','${alt}','open')">${formatDate(alt, true)}</button>`).join('')}
        </div>
      </div>`;
  }, 600);
}

function findNearbyAlternatives(artistId, fromDate) {
  const avail = AVAILABILITY[artistId];
  const fromDay = parseInt(fromDate.split('-')[2]);
  const candidates = Object.keys(avail)
    .filter(d => avail[d] === 'open')
    .map(d => ({ date: d, day: parseInt(d.split('-')[2]) }))
    .sort((a, b) => Math.abs(a.day - fromDay) - Math.abs(b.day - fromDay));
  return candidates.slice(0, 3).map(c => c.date);
}

function formatDate(d, short) {
  const day = parseInt(d.split('-')[2]);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const month = months[parseInt(d.split('-')[1]) - 1];
  return short ? `${month} ${day}` : `${month} ${day}, 2026`;
}

// ===== FEATURE 1: AI LOOK MATCHER =====
// Mocked vision/NLP: in production this calls an LLM with vision input (uploaded photo)
// or text description, extracts style attributes, and ranks artists by tag overlap +
// portfolio similarity. Here we simulate that pipeline with keyword extraction + scoring.

function renderMatcher() {
  return `
  <section style="background:var(--espresso); color:var(--ivory); padding:72px 40px 64px; position:relative; overflow:hidden;">
    <div class="hero-grain"></div>
    <div style="max-width:760px; margin:0 auto; position:relative;">
      <div class="hero-eyebrow">AI Look Match</div>
      <h1 style="font-size:44px; color:var(--ivory); margin-bottom:14px; font-weight:380;">Show us the look. <em style="font-style:italic; background:linear-gradient(100deg,var(--gold-bright),var(--blush) 60%,var(--gold-bright)); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent;">We'll find who can do it.</em></h1>
      <p style="opacity:0.68; font-size:15.5px; margin-bottom:36px; max-width:560px; color:rgba(250,245,236,0.78);">Describe your dream bridal look, or tap a reference. Our matching model reads finish, mood and intensity — then ranks real Delhi artists by actual portfolio fit, annotated like a stylist's mood board.</p>

      <div style="background:rgba(250,245,236,0.06); border:1px solid var(--line-dark); border-radius:18px; padding:24px; margin-bottom:28px; backdrop-filter:blur(6px);">
        <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:10px; color:var(--gold-bright); text-transform:uppercase; letter-spacing:0.05em;">Describe your look</label>
        <textarea id="lookInput" placeholder="e.g. Soft glam, dewy skin, minimal jewelry, not too much shimmer..." style="width:100%; padding:14px; border:1px solid var(--line-dark); border-radius:12px; font-family:inherit; font-size:14.5px; min-height:90px; resize:vertical; background:rgba(22,11,8,0.4); color:var(--ivory);"></textarea>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px;">
          <span style="font-size:12px; opacity:0.5;">or tap a reference image instead ↓</span>
          <button class="btn-primary" onclick="runMatch()">✨ Find my matches</button>
        </div>
      </div>

      <div style="margin-bottom:8px;">
        <div style="font-size:12.5px; font-weight:600; margin-bottom:14px; opacity:0.65; text-transform:uppercase; letter-spacing:0.05em; color:var(--gold-bright);">Reference looks</div>
        <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:14px;">
          ${SAMPLE_LOOKS.map(l => `
            <div onclick="runMatchFromSample('${l.id}')" style="cursor:pointer; border-radius:14px; overflow:hidden; border:2px solid var(--line-dark); transition:border-color 0.2s, transform 0.2s;" onmouseover="this.style.borderColor='var(--gold-bright)'; this.style.transform='translateY(-3px)'" onmouseout="this.style.borderColor='var(--line-dark)'; this.style.transform='translateY(0)'">
              <img src="${l.img}" style="width:100%; height:150px; object-fit:cover; display:block;" alt="${l.label}">
              <div style="font-size:11.5px; padding:9px; text-align:center; background:rgba(250,245,236,0.05); color:var(--ivory);">${l.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </section>

  <div id="matchResults"></div>
  `;
}

function runMatchFromSample(lookId) {
  const look = SAMPLE_LOOKS.find(l => l.id === lookId);
  document.getElementById('lookInput').value = look.label;
  computeAndRenderMatches(look.styles, look.label, look.img);
}

function runMatch() {
  const input = document.getElementById('lookInput').value.trim();
  if (!input) return;
  const styles = extractStylesFromText(input);
  computeAndRenderMatches(styles, input, null);
}

function extractStylesFromText(text) {
  const lower = text.toLowerCase();
  const matched = new Set();
  Object.keys(LOOK_KEYWORDS).forEach(kw => {
    if (lower.includes(kw)) {
      LOOK_KEYWORDS[kw].forEach(s => matched.add(s));
    }
  });
  if (matched.size === 0) {
    // fallback: default to most popular styles so the demo never shows empty
    return ["Soft Glam", "Minimal/Dewy"];
  }
  return Array.from(matched);
}

function computeAndRenderMatches(targetStyles, queryLabel, refImage) {
  const resultsEl = document.getElementById('matchResults');
  resultsEl.innerHTML = `<div style="text-align:center; padding:64px 40px; opacity:0.45; font-size:14px; background:var(--ivory);">Reading style attributes, scanning artist portfolios…</div>`;

  setTimeout(() => {
    const scored = ARTISTS.map(a => {
      const overlap = a.styles.filter(s => targetStyles.includes(s)).length;
      const score = Math.min(98, Math.round((overlap / targetStyles.length) * 70 + a.rating * 5 + Math.random() * 3));
      const matchedOn = a.styles.filter(s => targetStyles.includes(s));
      return { artist: a, score: overlap > 0 ? score : Math.round(score * 0.5), matchedOn };
    }).sort((a, b) => b.score - a.score).slice(0, 4);

    resultsEl.innerHTML = renderMoodBoard(scored, targetStyles, queryLabel, refImage);
    initMoodBoardLines();
  }, 900);
}

// ===== FEATURE 2: CONVERSATIONAL BOOKING ASSISTANT =====
// Mocked NLU: parses function type, budget, area and date hints from free text,
// then queries the same artist dataset. In production this would be an LLM call
// with function-calling against the booking API.
// Implementation lives in chat-widget.js as a global floating widget; chatBubble()
// below is shared markup reused by that widget.

function chatBubble(m) {
  const isBot = m.from === 'bot';
  return `
  <div style="display:flex; ${isBot ? '' : 'justify-content:flex-end;'}">
    <div style="max-width:78%; padding:13px 16px; border-radius:16px; font-size:14px; line-height:1.5;
      background:${isBot ? 'white' : 'var(--rani)'}; color:${isBot ? 'var(--ink)' : 'var(--ivory)'};
      border:${isBot ? '1px solid var(--line)' : 'none'};">
      ${m.text}
    </div>
  </div>
  `;
}
