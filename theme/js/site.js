/* 橙照 · 站点交互：主题切换、滚动状态、入场动画、阅读进度。无依赖。 */
(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  var STORAGE_KEY = 'cz-theme';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function currentTheme() {
    return root.dataset.theme === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(theme, persist) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    root.setAttribute('data-bs-theme', theme);
    if (body) {
      body.classList.toggle('quarto-dark', theme === 'dark');
      body.classList.toggle('quarto-light', theme !== 'dark');
    }
    var meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#15120F' : '#F7F2E8');
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (error) {
        /* 忽略隐私模式写入失败。 */
      }
    }
    var button = document.querySelector('.cz-theme-toggle');
    if (button) {
      var dark = theme === 'dark';
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? '切换到浅色模式' : '切换到深色模式');
      button.setAttribute('title', dark ? '切换到浅色模式' : '切换到深色模式');
      button.querySelector('.cz-theme-icon-sun').hidden = dark;
      button.querySelector('.cz-theme-icon-moon').hidden = !dark;
    }
  }

  function toggleTheme() {
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark', true);
  }

  function buildToggle() {
    if (document.querySelector('.cz-theme-toggle')) return;
    var tools = document.querySelector('.quarto-navbar-tools');
    var nav = document.querySelector('.navbar .navbar-nav.navbar-right') || document.querySelector('.navbar .navbar-nav');
    if (!tools && !nav) return;
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'cz-theme-toggle quarto-navigation-tool';
    button.setAttribute('aria-label', '切换到深色模式');
    button.setAttribute('aria-pressed', 'false');
    button.innerHTML =
      '<svg class="cz-theme-icon-sun" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round">' +
      '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"/>' +
      '</svg>' +
      '<svg class="cz-theme-icon-moon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M20 13.4A8.2 8.2 0 1 1 10.6 4a6.6 6.6 0 0 0 9.4 9.4Z"/>' +
      '</svg>';
    button.addEventListener('click', toggleTheme);
    if (tools) {
      tools.insertBefore(button, tools.firstChild);
    } else {
      var item = document.createElement('li');
      item.className = 'nav-item cz-theme-item';
      item.appendChild(button);
      var last = nav.lastElementChild;
      if (last) nav.insertBefore(item, last.nextSibling);
      else nav.appendChild(item);
    }
    applyTheme(currentTheme(), false);
  }

  function markScrolled() {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;
    navbar.classList.toggle('cz-nav-scrolled', window.scrollY > 12);
  }

  function reveal() {
    var targets = document.querySelectorAll('.reveal');
    if (targets.length === 0) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (target) {
        target.classList.add('is-visible');
      });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    targets.forEach(function (target, index) {
      target.style.setProperty('--reveal-delay', Math.min(index % 4, 3) * 70 + 'ms');
      observer.observe(target);
    });
  }

  function progress() {
    var bar = document.getElementById('cz-progress');
    var article = document.querySelector('.quarto-document-content');
    if (!bar || !article) {
      if (bar) bar.hidden = true;
      return;
    }
    var update = function () {
      var rect = article.getBoundingClientRect();
      var total = Math.max(article.offsetHeight - window.innerHeight, 1);
      var passed = Math.min(Math.max(-rect.top, 0), total);
      bar.style.transform = 'scaleX(' + (passed / total).toFixed(4) + ')';
    };
    document.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  function externalLinks() {
    document.querySelectorAll('.quarto-document-content a[href^="http"]').forEach(function (link) {
      if (link.hostname && link.hostname !== window.location.hostname) {
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  function relocateFooter() {
    var footer = document.querySelector('.cz-footer');
    if (footer && footer.parentElement !== body) body.appendChild(footer);
  }

  function init() {
    body.classList.add('cz-ready');
    relocateFooter();
    buildToggle();
    applyTheme(currentTheme(), false);
    markScrolled();
    window.addEventListener('scroll', markScrolled, { passive: true });
    reveal();
    progress();
    externalLinks();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
