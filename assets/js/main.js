/* ==========================================================================
   OSGL Developers — project portfolio
   Vanilla JS · project switcher · mobile menu · sticky enquiry bar
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Preserve the old /#location deep link by sending it to the project page.
  if ((window.location.pathname === '/' || window.location.pathname === '/index.html') &&
      window.location.hash === '#location') {
    window.location.replace('/godrej-msr-city/#location');
  }

  var header = $('[data-header]');
  var floatWa = $('.float-wa');
  var mobileBar = $('.mobile-bar');
  var scrollTicking = false;

  function updateHeader() {
    if (header) {
      header.classList.toggle('is-scrolled', window.scrollY > 26);
    }
    if (floatWa) {
      floatWa.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    }
    if (mobileBar) {
      mobileBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.5);
    }
    scrollTicking = false;
  }

  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      scrollTicking = true;
      window.requestAnimationFrame(updateHeader);
    }
  }, { passive: true });

  /* ------------------------------------------------------------------------
     Project switcher (<details>)
     ------------------------------------------------------------------------ */
  var switchers = $$('[data-project-switcher]');

  function closeSwitchers(except) {
    switchers.forEach(function (item) {
      if (item !== except) item.open = false;
    });
  }

  switchers.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) closeSwitchers(item);
    });
  });

  document.addEventListener('click', function (event) {
    if (!event.target.closest('[data-project-switcher]')) {
      closeSwitchers(null);
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeSwitchers(null);
    }
  });

  /* ------------------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------------------ */
  var menuToggle = $('[data-menu-toggle]');
  var mobileMenu = $('[data-mobile-menu]');
  var menuIsOpen = false;
  var menuLastFocus = null;

  if (mobileMenu) mobileMenu.setAttribute('inert', '');

  function openMenu() {
    if (!mobileMenu || !menuToggle) return;
    menuIsOpen = true;
    menuLastFocus = document.activeElement;
    closeSwitchers(null);
    mobileMenu.removeAttribute('inert');
    mobileMenu.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
    if (header) header.classList.add('is-menu-open');
    document.body.classList.add('no-scroll', 'menu-open');
    var firstLink = $('.mobile-project, .mobile-nav a', mobileMenu);
    if (firstLink) {
      window.setTimeout(function () { firstLink.focus(); }, 260);
    }
  }

  function closeMenu(returnFocus) {
    if (!mobileMenu || !menuToggle || !menuIsOpen) return;
    menuIsOpen = false;
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('inert', '');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    if (header) header.classList.remove('is-menu-open');
    document.body.classList.remove('no-scroll', 'menu-open');
    if (returnFocus) (menuLastFocus || menuToggle).focus();
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      if (menuIsOpen) closeMenu(true);
      else openMenu();
    });
  }

  if (mobileMenu) {
    $$('a', mobileMenu).forEach(function (link) {
      link.addEventListener('click', function () { closeMenu(false); });
    });
  }

  /* ------------------------------------------------------------------------
     Scroll reveal (subtle, optional)
     ------------------------------------------------------------------------ */
  var revealElements = $$('.reveal');
  var revealObserver = null;

  function revealAll() {
    revealElements.forEach(function (el) { el.classList.add('is-in'); });
  }

  function initReveal() {
    if (!revealElements.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealAll();
      return;
    }
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealElements.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ------------------------------------------------------------------------
     Keep keyboard focus inside the open menu (toggle + menu links loop)
     ------------------------------------------------------------------------ */
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menuIsOpen) {
      closeMenu(true);
      return;
    }
    if (event.key !== 'Tab' || !menuIsOpen || !mobileMenu || !menuToggle) return;

    var focusables = [menuToggle].concat($$('a, button', mobileMenu)).filter(function (el) {
      return el && el.getClientRects().length > 0 && window.getComputedStyle(el).visibility !== 'hidden';
    });
    if (!focusables.length) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  /* ------------------------------------------------------------------------
     Resize cleanup
     ------------------------------------------------------------------------ */
  var resizeTimer = null;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      if (window.innerWidth > 760 && menuIsOpen) closeMenu(false);
      updateHeader();
    }, 150);
  });

  /* ------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------ */
  initReveal();
  updateHeader();

  window.setTimeout(function () {
    if (revealElements.length && !document.querySelector('.reveal.is-in')) {
      revealAll();
    }
  }, 4000);
}());
