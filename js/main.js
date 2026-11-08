/* =========================================================
   Mauli Sliding and Glass: site script (no libraries)
   ========================================================= */

/* ---------------------------------------------------------
   1. BUSINESS DETAILS: fill these in when confirmed.
   Leave a value as '' to keep showing the placeholder.
   --------------------------------------------------------- */
const SITE = {
  // Shown on the page, e.g. '+91 98765 43210'
  phone: '+91 90224 08529',
  phone2: '+91 90752 72776',        // alternative number
  // WhatsApp number: digits only, with 91 country code, e.g. '919876543210'
  whatsapp: '919022408529',
  // Text in both languages, e.g. { en: 'Mon–Sat, 9:00 am – 8:00 pm', mr: 'सोम–शनि, सकाळी 9 ते रात्री 8' }
  hours: { en: 'Every day, 10:00 AM – 9:00 PM', mr: 'दररोज, सकाळी 10 ते रात्री 9' },
  hoursShort: { en: '10 AM – 9 PM', mr: 'सकाळी 10 ते रात्री 9' },   // shown in the hero
  street: { en: 'Shop No. 01, Gala No. 69, Opp. Market Yard & Ashtekar Snacks, Beed Road',
            mr: 'दुकान क्र. 01, गाळा क्र. 69, मार्केट यार्ड व आष्टेकर स्नॅक्ससमोर, बीड रोड' },
  owner: { en: 'Pradip (Mauli) Mule', mr: 'प्रदीप (माऊली) मुळे' },
  experience: { en: 'Since 2023', mr: '2023 पासून' },   // e.g. { en: '10+ years', mr: '10+ वर्षे' }
  // Google Maps: opens the shop's listing / directions (free, no API key needed)
  mapsUrl: 'https://maps.app.goo.gl/4UBhAn3v8gNAWKBp6',                 // shop's own Google Maps listing
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=18.7399871,75.3156445'   // shop's exact location
};

(function () {
  'use strict';

  const T = window.TRANSLATIONS || { en: {}, mr: {} };
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const digits = (s) => String(s || '').replace(/\D/g, '');

  /* ---------- 2. Language ---------- */
  // Remember the English text already in the HTML so we can switch back.
  const enText = {};
  const originals = new WeakMap();
  $$('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (!(key in enText)) enText[key] = el.textContent.trim();
    originals.set(el, el.textContent);
  });
  $$('[data-i18n-attr]').forEach((el) => {
    const saved = {};
    el.dataset.i18nAttr.split(',').forEach((pair) => {
      const [attr] = pair.split(':');
      saved[attr.trim()] = el.getAttribute(attr.trim()) || '';
    });
    originals.set(el, Object.assign(originals.get(el) ? { __text: originals.get(el) } : {}, { __attrs: saved }));
  });

  let lang = 'en';

  // Text for a key in the current language (falls back to English).
  function t(key) {
    if (lang === 'mr' && T.mr[key] != null) return T.mr[key];
    if (T.en[key] != null) return T.en[key];
    return enText[key] != null ? enText[key] : key;
  }

  function readSavedLang() {
    const fromUrl = new URLSearchParams(location.search).get('lang');
    if (fromUrl === 'mr' || fromUrl === 'en') return fromUrl;
    try { return localStorage.getItem('lang') === 'mr' ? 'mr' : 'en'; } catch (e) { return 'en'; }
  }

  function setLang(next, save) {
    lang = next === 'mr' ? 'mr' : 'en';
    document.documentElement.lang = lang;

    $$('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      const saved = originals.get(el);
      const enValue = typeof saved === 'string' ? saved : saved && saved.__text;
      el.textContent = lang === 'mr' && T.mr[key] != null ? T.mr[key] : enValue;
    });

    $$('[data-i18n-attr]').forEach((el) => {
      const saved = (originals.get(el) || {}).__attrs || {};
      el.dataset.i18nAttr.split(',').forEach((pair) => {
        const [attr, key] = pair.split(':').map((s) => s.trim());
        el.setAttribute(attr, lang === 'mr' && T.mr[key] != null ? T.mr[key] : saved[attr]);
      });
    });

    document.title = t('meta.title');
    const desc = $('meta[name="description"]');
    if (desc) desc.setAttribute('content', t('meta.description'));

    $$('.lang-switch button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));

    fillBusinessDetails();
    updateLinks();

    if (save) {
      try { localStorage.setItem('lang', lang); } catch (e) { /* private mode: ignore */ }
      const url = new URL(location.href);
      if (url.searchParams.has('lang')) { url.searchParams.delete('lang'); history.replaceState(null, '', url); }
    }
  }

  /* ---------- 3. Business details & links ---------- */
  function valueFor(field) {
    const v = SITE[field];
    if (!v) return '';
    if (typeof v === 'string') return v;
    return v[lang] || v.en || '';
  }

  function fillBusinessDetails() {
    $$('[data-site]').forEach((el) => {
      const value = valueFor(el.dataset.site);
      if (!value) return;                // keep the placeholder
      el.removeAttribute('data-i18n');   // the real value replaces the translated placeholder
      el.classList.remove('ph');
      el.textContent = value;
    });
  }

  function waUrl(message) {
    const num = digits(SITE.whatsapp);
    return num ? 'https://wa.me/' + num + '?text=' + encodeURIComponent(message) : '';
  }

  function messageFor(el) {
    if (el.dataset.wa === 'service') return t('wa.service').replace('{service}', t(el.dataset.service));
    return t('wa.general');
  }

  function updateLinks() {
    $$('.js-wa').forEach((a) => {
      const url = waUrl(messageFor(a));
      if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; }
      else { a.setAttribute('href', '#contact'); a.removeAttribute('target'); }
    });
    $$('.js-call').forEach((a) => {
      const tel = digits(SITE[a.dataset.phone || 'phone']);   // data-phone="phone2" uses the alternative number
      a.setAttribute('href', tel ? 'tel:+' + (tel.length === 10 ? '91' + tel : tel) : '#contact');
    });
    $$('.js-maps').forEach((a) => a.setAttribute('href', a.classList.contains('js-dir') ? SITE.directionsUrl : SITE.mapsUrl));
  }

  const status = $('.form-status');
  function showStatus(msg) {
    if (!status) return;
    status.textContent = msg;
  }

  // If WhatsApp is not configured yet, explain instead of failing silently.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('.js-wa');
    if (a && !digits(SITE.whatsapp)) showStatus(t('wa.notSet'));
  });

  /* ---------- 4. Enquiry form → WhatsApp ---------- */
  const form = $('#enquiry');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.elements.name.value.trim();
      const serviceKey = form.elements.service.value;
      const details = form.elements.details.value.trim();
      if (!serviceKey && !details) { showStatus(t('form.empty')); return; }
      if (!digits(SITE.whatsapp)) { showStatus(t('wa.notSet')); return; }

      const msg = t('wa.form')
        .replace('{name}', name || t('common.na'))
        .replace('{service}', serviceKey ? t(serviceKey) : t('common.na'))
        .replace('{details}', details || t('common.na'));
      const url = waUrl(msg);
      showStatus('');
      const win = window.open(url, '_blank');
      if (win) win.opener = null; else location.href = url;
    });
  }

  /* ---------- 5. Mobile menu ---------- */
  const menuBtn = $('.menu-btn');
  const nav = $('#site-nav');
  function setMenu(open) {
    if (!menuBtn || !nav) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
    });
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') && !e.target.closest('.site-header')) setMenu(false);
    });
  }

  /* ---------- 6. Header shadow on scroll ---------- */
  const header = $('.site-header');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { header.classList.toggle('scrolled', window.scrollY > 8); ticking = false; });
  }, { passive: true });

  /* ---------- 7. Reveal on scroll ---------- */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* ---------- 8. Gallery lightbox ---------- */
  const box = $('#lightbox');
  const items = $$('.g-item');
  if (box && typeof box.showModal === 'function' && items.length) {
    const img = $('#lb-img');
    const cap = $('#lb-cap');
    let index = 0;
    let lastFocus = null;

    const show = (i) => {
      index = (i + items.length) % items.length;
      const thumb = $('img', items[index]);
      img.src = items[index].getAttribute('href');
      img.alt = thumb.alt;
      cap.textContent = $('.g-cap', items[index]).textContent;
    };

    items.forEach((item, i) => item.addEventListener('click', (e) => {
      e.preventDefault();
      lastFocus = item;
      show(i);
      box.showModal();
    }));
    $('.lb-close', box).addEventListener('click', () => box.close());
    $('.lb-prev', box).addEventListener('click', () => show(index - 1));
    $('.lb-next', box).addEventListener('click', () => show(index + 1));
    box.addEventListener('click', (e) => { if (e.target === box) box.close(); });   // tap outside the photo
    box.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
    box.addEventListener('close', () => { if (lastFocus) lastFocus.focus(); });

    // Swipe left/right on phones
    let startX = null;
    box.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', (e) => {
      if (startX == null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
      startX = null;
    }, { passive: true });
  }

  /* ---------- 9. Start ---------- */
  $$('.lang-switch button').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang, true)));
  $$('.js-year').forEach((el) => { el.textContent = new Date().getFullYear(); });
  setLang(readSavedLang(), false);

  if (!digits(SITE.whatsapp)) console.info('[Mauli] Add the WhatsApp number in js/main.js (SITE.whatsapp) to activate WhatsApp buttons.');
})();
