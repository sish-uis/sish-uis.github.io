// SISH · interacción: header, slider de portada y animaciones al hacer scroll
document.documentElement.classList.add('sish-js');

(function () {
  'use strict';

  // ---------------- Header ----------------
  function marcarActivos() {
    var path = window.location.pathname.replace(/index\.html$/, '');
    document.querySelectorAll('#mainNav .nav-link, #mainNav .dropdown-item, .list-group-item a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || href === '#') return;
      if (href === path || (href !== '/' && path.indexOf(href) === 0)) {
        a.classList.add('active');
        var drop = a.closest('.dropdown');
        if (drop) drop.querySelector('.nav-link').classList.add('active');
      }
    });
  }

  function iniciarHeader() {
    var header = document.getElementById('sishHeader');
    if (!header) return false;
    // Histéresis: encoge al pasar 120px y solo vuelve a crecer cerca del tope.
    // Así el cambio de alto del header no hace que la página tiemble.
    var onScroll = function () {
      var y = window.scrollY;
      if (y > 120) header.classList.add('is-scrolled');
      else if (y < 10) header.classList.remove('is-scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    marcarActivos();
    return true;
  }

  // ---------------- Slider de portada ----------------
  function iniciarSlider() {
    var slider = document.getElementById('sishSlider');
    if (!slider) return;
    var slides = slider.querySelectorAll('.sish-slide');
    var dots = slider.querySelectorAll('.sish-dot');
    var DURACION = 7000;
    var i = 0, timer = null;
    slider.style.setProperty('--dur', DURACION / 1000 + 's');

    function ir(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('on', k === i); s.setAttribute('aria-hidden', k === i ? 'false' : 'true'); });
      dots.forEach(function (d, k) {
        d.classList.remove('on');
        if (k === i) { void d.offsetWidth; d.classList.add('on'); }
      });
      reiniciar();
    }
    function reiniciar() {
      clearTimeout(timer);
      if (!slider.classList.contains('is-paused')) timer = setTimeout(function () { ir(i + 1); }, DURACION);
    }
    dots.forEach(function (d, k) { d.addEventListener('click', function () { ir(k); }); });
    var prev = slider.querySelector('.sish-arrows .prev'), next = slider.querySelector('.sish-arrows .next');
    if (prev) prev.addEventListener('click', function () { ir(i - 1); });
    if (next) next.addEventListener('click', function () { ir(i + 1); });

    // Pausa al pasar el mouse
    slider.addEventListener('mouseenter', function () { slider.classList.add('is-paused'); clearTimeout(timer); });
    slider.addEventListener('mouseleave', function () { slider.classList.remove('is-paused'); reiniciar(); });

    // Deslizar con el dedo en el celular
    var x0 = null;
    slider.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) ir(i + (dx < 0 ? 1 : -1));
      x0 = null;
    });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) slider.classList.add('is-paused');
    ir(0);
  }

  // ---------------- Aparición al hacer scroll ----------------
  function iniciarReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (e) { io.observe(e); });
  }
  window.sishReveal = iniciarReveal;

  document.addEventListener('DOMContentLoaded', function () {
    iniciarSlider();
    iniciarReveal();
    if (iniciarHeader()) return;
    var ph = document.getElementById('header-placeholder');
    if (!ph) return;
    var mo = new MutationObserver(function () { if (iniciarHeader()) mo.disconnect(); });
    mo.observe(ph, { childList: true, subtree: true });
  });
})();
