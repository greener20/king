/* Theme, mobile navigation, active section state, reveal animations, and footer year. */
(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-button');
  const menuButton = document.querySelector('.menu-button');
  const navMenu = document.querySelector('.nav-menu');
  const readTheme = () => { try { return localStorage.getItem('personal-portfolio-theme'); } catch (_) { return null; } };
  const saveTheme = value => { try { localStorage.setItem('personal-portfolio-theme', value); } catch (_) { /* Storage is optional. */ } };
  const systemTheme = () => matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  function setTheme(theme, persist = true) {
    root.dataset.theme = theme;
    themeButton?.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    themeButton?.setAttribute('title', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    if (themeButton) themeButton.innerHTML = theme === 'dark'
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z"/></svg>';
    if (persist) saveTheme(theme);
  }
  const saved = readTheme();
  setTheme(saved === 'dark' || saved === 'light' ? saved : systemTheme(), false);
  themeButton?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menuButton.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
    navMenu?.classList.toggle('is-open', !open);
  });
  navMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navMenu.classList.remove('is-open'); menuButton?.setAttribute('aria-expanded', 'false'); menuButton?.setAttribute('aria-label', 'Open navigation');
  }));
  const year = document.querySelector('#year'); if (year) year.textContent = new Date().getFullYear();
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
      });
    }), { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(section => sectionObserver.observe(section));
  }
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('js-ready');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: .12, rootMargin: '0px 0px -25px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
})();
