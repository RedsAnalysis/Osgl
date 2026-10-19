/* ==========================================================================
   OSGL Developers — Godrej MSR City
   Vanilla JS. No frameworks, no build step.
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var phoneNumber = '+918971181288';
  var waBase = 'https://wa.me/918971181288?text=';

  /* ------------------------------------------------------------------------
     Header state
     ------------------------------------------------------------------------ */
  var header = $('[data-header]');
  var floatWa = $('.float-wa');
  var mobileBar = $('.mobile-bar');
  var scrollTicking = false;

  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 26) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
    if (floatWa) {
      floatWa.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    }
    if (mobileBar) {
      mobileBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.5);
    }
    updateActiveNav();
    scrollTicking = false;
  }

  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      scrollTicking = true;
      window.requestAnimationFrame(updateHeader);
    }
  }, { passive: true });

  /* ------------------------------------------------------------------------
     Active navigation link
     ------------------------------------------------------------------------ */
  var navLinks = $$('.nav a');
  var navSections = navLinks.map(function (link) {
    var id = link.getAttribute('href');
    return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
  }).filter(Boolean);

  function updateActiveNav() {
    if (!navLinks.length || !navSections.length) return;
    var marker = window.scrollY + (header ? header.offsetHeight : 84) + 140;
    var current = '';
    navSections.forEach(function (section) {
      var top = section.getBoundingClientRect().top + window.scrollY;
      if (top <= marker) current = '#' + section.id;
    });
    navLinks.forEach(function (link) {
      var isCurrent = link.getAttribute('href') === current;
      link.classList.toggle('is-current', isCurrent);
      if (isCurrent) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  /* ------------------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------------------ */
  var menuToggle = $('[data-menu-toggle]');
  var mobileMenu = $('[data-mobile-menu]');
  var menuIsOpen = false;
  var menuLastFocus = null;

  if (mobileMenu) {
    mobileMenu.setAttribute('inert', '');
  }

  function openMenu() {
    if (!mobileMenu || !menuToggle) return;
    menuIsOpen = true;
    menuLastFocus = document.activeElement;
    mobileMenu.removeAttribute('inert');
    mobileMenu.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
    header.classList.add('is-menu-open');
    document.body.classList.add('no-scroll', 'menu-open');
    var firstLink = $('.mobile-nav a', mobileMenu);
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
    header.classList.remove('is-menu-open');
    document.body.classList.remove('no-scroll', 'menu-open');
    if (returnFocus) {
      (menuLastFocus || menuToggle).focus();
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      if (menuIsOpen) {
        closeMenu(true);
      } else {
        openMenu();
      }
    });
  }

  if (mobileMenu) {
    $$('.mobile-nav a, .mobile-menu-foot a', mobileMenu).forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu(false);
      });
    });
  }

  /* ------------------------------------------------------------------------
     Scroll reveal
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
    }, {
      root: null,
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.05
    });
    revealElements.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ------------------------------------------------------------------------
     Gallery lightbox
     ------------------------------------------------------------------------ */
  var galleryItems = $$('.gallery-item');
  var lightbox = $('#lightbox');
  var lbImg = $('[data-lb-img]', lightbox || document);
  var lbCaption = $('[data-lb-caption]', lightbox || document);
  var lbClose = $('[data-lb-close]', lightbox || document);
  var lbPrev = $('[data-lb-prev]', lightbox || document);
  var lbNext = $('[data-lb-next]', lightbox || document);
  var lbIndex = 0;
  var lbLastFocus = null;
  var lbIsOpen = false;

  function preloadLightbox(index) {
    if (!galleryItems[index]) return;
    var url = galleryItems[index].getAttribute('data-full');
    if (url) {
      var preload = new Image();
      preload.src = url;
    }
  }

  function showLightboxImage(index) {
    if (!galleryItems.length) return;
    lbIndex = (index + galleryItems.length) % galleryItems.length;
    var trigger = galleryItems[lbIndex];
    var src = trigger.getAttribute('data-full');
    var caption = trigger.getAttribute('data-caption') || '';
    var thumb = $('img', trigger);
    lbImg.src = src;
    lbImg.alt = thumb ? thumb.alt : caption;
    lbCaption.textContent = caption;
    preloadLightbox(lbIndex + 1);
    preloadLightbox(lbIndex - 1);
  }

  function openLightbox(index) {
    if (!lightbox) return;
    lbIsOpen = true;
    lbLastFocus = document.activeElement;
    showLightboxImage(index);
    lightbox.hidden = false;
    document.body.classList.add('no-scroll');
    lbClose.focus();
    document.addEventListener('keydown', lightboxKeydown);
  }

  function closeLightbox() {
    if (!lightbox || !lbIsOpen) return;
    lbIsOpen = false;
    lightbox.hidden = true;
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', lightboxKeydown);
    if (lbLastFocus) lbLastFocus.focus();
  }

  function lightboxKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeLightbox();
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showLightboxImage(lbIndex - 1);
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showLightboxImage(lbIndex + 1);
      return;
    }
    if (event.key === 'Tab') {
      var focusable = $$('button', lightbox).filter(function (el) {
        return !el.disabled && el.offsetParent !== null;
      });
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  galleryItems.forEach(function (item, index) {
    item.addEventListener('click', function () { openLightbox(index); });
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev) lbPrev.addEventListener('click', function () { showLightboxImage(lbIndex - 1); });
  if (lbNext) lbNext.addEventListener('click', function () { showLightboxImage(lbIndex + 1); });
  if (lightbox) {
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) closeLightbox();
    });
  }

  /* ------------------------------------------------------------------------
     Residences filter
     ------------------------------------------------------------------------ */
  var filterButtons = $$('[data-filter]');
  var unitCards = $$('.unit');
  var unitCount = $('#unit-count');

  function applyFilter(filter) {
    var visible = 0;
    unitCards.forEach(function (card) {
      var beds = card.getAttribute('data-beds');
      var show = filter === 'all' || beds === filter;
      card.classList.toggle('is-hidden', !show);
      if (show) visible += 1;
    });
    filterButtons.forEach(function (button) {
      var active = button.getAttribute('data-filter') === filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    if (unitCount) {
      unitCount.textContent = visible + (visible === 1 ? ' configuration' : ' configurations');
    }
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      applyFilter(button.getAttribute('data-filter') || 'all');
    });
  });

  /* ------------------------------------------------------------------------
     EMI calculator
     ------------------------------------------------------------------------ */
  var priceEl = $('#price');
  var downEl = $('#down');
  var rateEl = $('#rate');
  var yearsEl = $('#years');
  var priceOut = $('#price-out');
  var downOut = $('#down-out');
  var rateOut = $('#rate-out');
  var yearsOut = $('#years-out');
  var emiOut = $('#emi-out');
  var loanOut = $('#loan-out');
  var interestOut = $('#interest-out');
  var totalOut = $('#total-out');
  var calcCta = $('#calc-cta');
  var presetButtons = $$('.calc-presets button');
  var inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

  function money(value) {
    return '₹' + inr.format(Math.round(value));
  }

  function setFill(input) {
    if (!input) return;
    var min = parseFloat(input.min) || 0;
    var max = parseFloat(input.max) || 100;
    var value = parseFloat(input.value) || 0;
    var pct = max === min ? 0 : ((value - min) / (max - min)) * 100;
    input.style.setProperty('--fill', Math.max(0, Math.min(100, pct)) + '%');
  }

  function updatePresetState(price) {
    presetButtons.forEach(function (button) {
      var isMatch = parseFloat(button.getAttribute('data-price')) === price;
      button.classList.toggle('is-active', isMatch);
      button.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
    });
  }

  function calculateEMI() {
    if (!priceEl || !downEl || !rateEl || !yearsEl) return;

    var price = parseFloat(priceEl.value) || 0;
    var downPct = parseFloat(downEl.value) || 0;
    var annualRate = parseFloat(rateEl.value) || 0;
    var years = parseFloat(yearsEl.value) || 0;

    var downAmount = price * (downPct / 100);
    var principal = price - downAmount;
    var monthlyRate = annualRate / 12 / 100;
    var months = Math.round(years * 12);

    var emi = 0;
    if (principal > 0 && months > 0) {
      if (monthlyRate === 0) {
        emi = principal / months;
      } else {
        var factor = Math.pow(1 + monthlyRate, months);
        emi = principal * monthlyRate * factor / (factor - 1);
      }
    }

    var totalPayable = emi * months;
    var totalInterest = totalPayable - principal;

    priceOut.textContent = money(price);
    downOut.textContent = downPct + '% · ' + money(downAmount);
    rateOut.textContent = annualRate.toFixed(1) + '%';
    yearsOut.textContent = years + ' year' + (years === 1 ? '' : 's');
    emiOut.textContent = money(emi);
    loanOut.textContent = money(principal);
    interestOut.textContent = money(totalInterest);
    totalOut.textContent = money(totalPayable);

    setFill(priceEl);
    setFill(downEl);
    setFill(rateEl);
    setFill(yearsEl);
    updatePresetState(price);

    if (calcCta) {
      var message = 'Hi OSGL, I would like the exact payment plan for Godrej MSR City. ' +
        'Property price ' + money(price) + ', down payment ' + downPct + '% (' + money(downAmount) + '), ' +
        'loan ' + money(principal) + ' at ' + annualRate.toFixed(1) + '% for ' + years + ' years. ' +
        'Indicative EMI ' + money(emi) + '. Please share the exact plan.';
      calcCta.href = waBase + encodeURIComponent(message);
    }
  }

  [priceEl, downEl, rateEl, yearsEl].forEach(function (input) {
    if (input) {
      input.addEventListener('input', calculateEMI);
      input.addEventListener('change', calculateEMI);
    }
  });

  presetButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      if (!priceEl) return;
      priceEl.value = button.getAttribute('data-price');
      calculateEMI();
    });
  });

  if (priceEl) {
    calculateEMI();
  }

  /* ------------------------------------------------------------------------
     Lead source (UTM capture)
     ------------------------------------------------------------------------ */
  var leadSource = $('#lead-source');
  var sourceValue = '';

  try {
    var params = new URLSearchParams(window.location.search);
    var parts = [];
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach(function (key) {
      var value = params.get(key);
      if (value) parts.push(value);
    });
    var fromUrl = parts.join(' / ');
    if (fromUrl) {
      sourceValue = fromUrl;
      window.sessionStorage.setItem('osgl_lead_source', fromUrl);
    } else {
      sourceValue = window.sessionStorage.getItem('osgl_lead_source') || '';
    }
  } catch (error) {
    sourceValue = '';
  }

  if (leadSource) leadSource.value = sourceValue;

  /* ------------------------------------------------------------------------
     Enquiry form -> WhatsApp (static page, no backend)
     ------------------------------------------------------------------------ */
  var form = $('#enquiry-form');
  var nameField = $('#name');
  var phoneField = $('#phone');
  var interestField = $('#interest');
  var formStatus = $('#form-status');

  function setFieldInvalid(field, invalid) {
    if (!field) return;
    if (invalid) {
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.removeAttribute('aria-invalid');
    }
  }

  function openWhatsApp(url) {
    var link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function showStatus(message, isOk, fallbackUrl) {
    if (!formStatus) return;
    formStatus.textContent = '';
    formStatus.classList.toggle('is-ok', !!isOk);
    formStatus.appendChild(document.createTextNode(message));
    if (fallbackUrl) {
      var link = document.createElement('a');
      link.href = fallbackUrl;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = ' Tap here to open WhatsApp.';
      link.style.textDecoration = 'underline';
      formStatus.appendChild(link);
    }
  }

  if (form) {
    [nameField, phoneField].forEach(function (field) {
      if (!field) return;
      field.addEventListener('input', function () {
        setFieldInvalid(field, false);
        if (formStatus) formStatus.textContent = '';
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var name = nameField ? nameField.value.trim() : '';
      var phone = phoneField ? phoneField.value.trim() : '';
      var digits = phone.replace(/\D/g, '');
      var validPhone = /^(?:91)?[6-9]\d{9}$/.test(digits);
      var interest = interestField ? interestField.value : 'the cost sheet';

      var nameValid = name.length >= 2;
      var firstInvalid = null;

      setFieldInvalid(nameField, !nameValid);
      setFieldInvalid(phoneField, !validPhone);

      if (!nameValid) {
        firstInvalid = nameField;
        showStatus('Please enter your name so we know who we are speaking with.');
        if (nameField) nameField.focus();
        return;
      }

      if (!validPhone) {
        firstInvalid = phoneField;
        showStatus('Please enter a valid 10-digit Indian mobile number.');
        if (phoneField) phoneField.focus();
        return;
      }

      if (firstInvalid) firstInvalid.focus();

      var message = 'Hi OSGL, I am ' + name + '. I would like ' + interest +
        ' for Godrej MSR City. My number is ' + phone + '.';
      if (sourceValue) {
        message += ' (Ref: ' + sourceValue + ')';
      }

      var url = waBase + encodeURIComponent(message);
      openWhatsApp(url);
      showStatus('Opening WhatsApp in a new tab. If it did not open,', true, url);
    });
  }

  /* ------------------------------------------------------------------------
     Exclusive FAQ accordion (fallback for browsers without details[name])
     ------------------------------------------------------------------------ */
  var faqItems = $$('.faq');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item && other.open) other.open = false;
      });
    });
  });

  /* ------------------------------------------------------------------------
     Escape closes menu / lightbox
     ------------------------------------------------------------------------ */
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    if (lbIsOpen) return;
    if (menuIsOpen) {
      closeMenu(true);
    }
  });

  /* ------------------------------------------------------------------------
     Resize cleanup
     ------------------------------------------------------------------------ */
  var resizeTimer = null;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      if (window.innerWidth > 1020 && menuIsOpen) closeMenu(false);
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

  // Keep a single, consistent phone number if it is ever changed here.
  $$('a[href^="tel:"]').forEach(function (link) {
    if (link.getAttribute('href') !== 'tel:' + phoneNumber) {
      link.setAttribute('href', 'tel:' + phoneNumber);
    }
  });
}());
