/* ==========================================================================
   MAMADI DIALLO — PORTFOLIO · interactions
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Thème clair / sombre ---------- */
  var root = document.documentElement;
  var toggle = document.getElementById('themeToggle');
  try {
    var saved = localStorage.getItem('md-portfolio-theme');
    if (saved) root.setAttribute('data-theme', saved);
  } catch (e) {}
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('md-portfolio-theme', next); } catch (e) {}
    });
  }

  /* ---------- Année ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Menu mobile ---------- */
  var menuBtn = document.getElementById('menuBtn');
  var navLinks = document.getElementById('navLinks');
  function closeMenu() {
    if (navLinks) navLinks.classList.remove('open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  if (navLinks) {
    Array.prototype.forEach.call(navLinks.querySelectorAll('a'), function (a) {
      a.addEventListener('click', closeMenu);
    });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Lien de navigation actif (déclaré avant onScroll) ---------- */
  var sections = ['accueil', 'apropos', 'competences', 'projets', 'contact'];
  var navAnchors = navLinks ? navLinks.querySelectorAll('a') : [];
  function updateNav() {
    var current = '';
    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 160) current = id;
    });
    Array.prototype.forEach.call(navAnchors, function (a) {
      var href = a.getAttribute('href') || '';
      a.classList.toggle('active', href === '#' + current);
    });
  }

  /* ---------- En-tête + progression ---------- */
  var header = document.getElementById('siteHeader');
  var progress = document.getElementById('scrollProgress');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('scrolled', y > 20);
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }
    updateNav();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Révélations au scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    Array.prototype.forEach.call(reveals, function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(el);
    });
    var cats = document.querySelectorAll('.skill-category');
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in-view'); io2.unobserve(entry.target); }
      });
    }, { threshold: 0.25 });
    Array.prototype.forEach.call(cats, function (el) { io2.observe(el); });
  } else {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('in-view'); });
    Array.prototype.forEach.call(document.querySelectorAll('.skill-category'), function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Filtres de projets ---------- */
  var filters = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('.project-card');
  Array.prototype.forEach.call(filters, function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      Array.prototype.forEach.call(filters, function (b) {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      Array.prototype.forEach.call(cards, function (card) {
        var cats = card.getAttribute('data-cat') || '';
        var show = (f === 'all') || (' ' + cats + ' ').indexOf(' ' + f + ' ') !== -1;
        card.classList.toggle('hidden', !show);
      });
    });
  });
})();
