// ===== APP ROUTER =====
 
function navigate(view) {
  STATE.view = view;
  render();
  window.scrollTo({ top: 0, behavior: 'instant' });
}
 
function renderNav() {
  const links = [
    { id: 'home', label: 'Home' },
    { id: 'browse', label: 'Browse Artists' },
    { id: 'matcher', label: 'Find My Look' }
  ];
  const darkViews = ['home', 'matcher'];
  const isDark = darkViews.includes(STATE.view);
  return `
  <nav class="nav ${isDark ? 'on-dark' : ''}" id="mainNav" data-dark-capable="${isDark}">
    <div class="nav-brand" onclick="navigate('home')" style="cursor:pointer;">Sindoor<span class="dot">&amp;</span>Co.</div>
    <div class="nav-links">
      ${links.map(l => `<a class="${STATE.view === l.id ? 'active' : ''}" onclick="navigate('${l.id}')">${l.label}</a>`).join('')}
    </div>
    <button class="nav-cta" onclick="navigate('matcher')">✨ Find my artist</button>
  </nav>
  `;
}
 
function setupNavScroll() {
  window.onscroll = () => {
    const nav = document.getElementById('mainNav');
    if (!nav || nav.dataset.darkCapable !== 'true') return;
    // hero sections are roughly viewport-height-ish; once scrolled past, drop dark mode
    const heroEl = document.querySelector('.hero');
    const threshold = heroEl ? heroEl.getBoundingClientRect().height - 80 : 500;
    if (window.scrollY > threshold) {
      nav.classList.remove('on-dark');
    } else {
      nav.classList.add('on-dark');
    }
  };
}
 
function render() {
  const app = document.getElementById('app');
  let content = '';
  switch (STATE.view) {
    case 'home': content = renderHome(); break;
    case 'browse': content = renderBrowse(); break;
    case 'artist': content = renderArtistProfile(); break;
    case 'matcher': content = renderMatcher(); break;
    default: content = renderHome();
  }
 
  app.innerHTML = `
    ${renderNav()}
    <div class="view active">${content}</div>
    <footer>Sindoor &amp; Co. — Delhi Bridal Beauty Booking Platform</footer>
  `;
 
  setupNavScroll();
}
 
document.addEventListener('DOMContentLoaded', render);
// fallback in case script runs after DOMContentLoaded already fired
if (document.readyState !== 'loading') render();
