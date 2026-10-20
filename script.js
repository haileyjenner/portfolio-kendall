/* hailey's portfolio — no frameworks or external JavaScript dependencies. */
(() => {
  'use strict';
  document.documentElement.classList.add('js-enabled');

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const menuButton = $('#menu-toggle');
  const nav = $('#primary-nav');
  const navLinks = $$('.nav-link');
  const themeButton = $('#theme-toggle');
  const searchButton = $('#search-trigger');
  const searchDialog = $('#search-dialog');
  const searchClose = $('#search-close');
  const searchInput = $('#site-search');
  const searchResults = $('#search-results');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!motion.matches && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('motion-ready');
  }

  // A mobile menu should never trap visitors or unexpectedly remain open.
  function closeMenu() {
    document.body.classList.remove('nav-open');
    if (menuButton) {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation menu');
    }
  }

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const opening = !document.body.classList.contains('nav-open');
      document.body.classList.toggle('nav-open', opening);
      menuButton.setAttribute('aria-expanded', String(opening));
      menuButton.setAttribute('aria-label', opening ? 'Close navigation menu' : 'Open navigation menu');
    });
    navLinks.forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('click', event => {
      if (document.body.classList.contains('nav-open') && !event.target.closest('.header-inner')) closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 960) closeMenu();
    }, { passive: true });
  }

  // Persist the chosen theme where storage is permitted, including file URLs.
  const themeKey = 'hailey-portfolio-theme';
  let savedTheme = 'day';
  try { savedTheme = localStorage.getItem(themeKey) === 'night' ? 'night' : 'day'; } catch { /* private mode */ }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    if (themeButton) {
      themeButton.setAttribute('aria-pressed', String(theme === 'night'));
      themeButton.setAttribute('aria-label', theme === 'night' ? 'Switch to pink daytime theme' : 'Switch to plum nighttime theme');
      themeButton.title = themeButton.getAttribute('aria-label');
    }
    const metaTheme = $('meta[name="theme-color"]');
    if (metaTheme) metaTheme.content = theme === 'night' ? '#321a34' : '#fbd9e8';
  }

  applyTheme(savedTheme);
  themeButton?.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'night' ? 'day' : 'night';
    applyTheme(nextTheme);
    try { localStorage.setItem(themeKey, nextTheme); } catch { /* storage optional */ }
  });

  // Search is intentionally limited to real, published sections in this page.
  const destinations = [
    { name: 'Home', subtitle: 'Meet Hailey Martinez', href: '#home', keywords: 'introduction welcome hero profile' },
    { name: 'About Me', subtitle: 'A 4th-year ICCT Computer Engineering student', href: '#about', keywords: 'biography hobbies interests kdrama dancing singing festivals adventure' },
    { name: 'Education', subtitle: 'Marikina Polytechnic College and ICCT Main Cainta', href: '#education', keywords: 'school college bsele bscoe circuits semiconductor architecture firmware network' },
    { name: 'Work Experience', subtitle: 'Tech Mahindra / TechM — Sales Representative', href: '#experience', keywords: 'career sales representative employment work job 2025 2026' },
    { name: 'Projects', subtitle: 'A place for future creative work', href: '#projects', keywords: 'project portfolio coming soon build' },
    { name: 'Tech Stack & Skills', subtitle: 'Python, HTML, CSS, JavaScript, Java, Kotlin, C++', href: '#skills', keywords: 'skills programming languages technology coding engineering' },
    { name: 'Contacts', subtitle: 'Email, GitHub, Gmail, Facebook, and more', href: '#contacts', keywords: 'connect email linkedin resume github gmail facebook social twitter' },
  ];

  function makeResult(destination) {
    const anchor = document.createElement('a');
    anchor.className = 'search-result';
    anchor.href = destination.href;

    const copy = document.createElement('span');
    const title = document.createElement('strong');
    title.textContent = destination.name;
    const subtitle = document.createElement('small');
    subtitle.textContent = destination.subtitle;
    copy.append(title, subtitle);

    const arrow = document.createElement('span');
    arrow.className = 'search-result-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';
    anchor.append(copy, arrow);
    anchor.addEventListener('click', () => searchDialog?.close());
    return anchor;
  }

  function renderSearch(query) {
    if (!searchResults) return;
    searchResults.replaceChildren();
    const term = query.toLocaleLowerCase().trim();
    const matches = term
      ? destinations.filter(item => `${item.name} ${item.subtitle} ${item.keywords}`.toLocaleLowerCase().includes(term))
      : destinations;
    if (!matches.length) {
      const empty = document.createElement('p');
      empty.className = 'search-empty';
      empty.textContent = 'No matches yet — try “skills”, “email”, or “education”.';
      searchResults.append(empty);
      return;
    }
    matches.forEach(item => searchResults.append(makeResult(item)));
  }

  function openSearch() {
    if (!searchDialog) return;
    closeMenu();
    if (!searchDialog.open) searchDialog.showModal();
    if (searchInput) {
      searchInput.value = '';
      renderSearch('');
      searchInput.focus();
    }
  }

  searchButton?.addEventListener('click', openSearch);
  searchClose?.addEventListener('click', () => searchDialog?.close());
  searchInput?.addEventListener('input', () => renderSearch(searchInput.value));
  searchInput?.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      const first = $('.search-result', searchResults);
      if (first) {
        event.preventDefault();
        first.click();
      }
    }
  });
  searchDialog?.addEventListener('click', event => {
    if (event.target === searchDialog) searchDialog.close();
  });
  searchDialog?.addEventListener('close', () => searchButton?.focus());
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
    if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === 'k') {
      event.preventDefault();
      if (searchDialog?.open) searchDialog.close();
      else openSearch();
    }
  });

  // Respect reduced-motion users and never conceal content if IO is missing.
  const revealItems = $$('[data-reveal]');
  if (!motion.matches && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 30px 0px' });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Navigation highlighting does not interfere with native anchor behavior.
  // Matches visual/document flow: contacts precede about, while work and
  // projects share a row (keep the user's selected link highlighted there).
  const sections = ['home', 'contacts', 'about', 'experience', 'projects', 'skills'];
  let highlightQueued = false;
  function highlightCurrentSection() {
    highlightQueued = false;
    const mark = window.scrollY + Math.min(window.innerHeight * .35, 250);
    let current = 'home';
    sections.forEach(id => {
      const section = document.getElementById(id);
      if (!section) return;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      if (sectionTop > mark) return;
      if (id === 'projects' && current === 'experience' && window.location.hash !== '#projects') return;
      current = id;
    });
    navLinks.forEach(link => {
      const active = link.hash === `#${current}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function scheduleHighlight() {
    if (highlightQueued) return;
    highlightQueued = true;
    requestAnimationFrame(highlightCurrentSection);
  }
  window.addEventListener('scroll', scheduleHighlight, { passive: true });
  window.addEventListener('resize', scheduleHighlight, { passive: true });
  highlightCurrentSection();

  $('#back-to-top')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: motion.matches ? 'auto' : 'smooth' }));
  const year = $('#copyright-year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
