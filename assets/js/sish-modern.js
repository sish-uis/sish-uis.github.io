// SISH · detalles modernos: header con sombra al bajar y link activo
(function () {
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
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 10); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    marcarActivos();
    return true;
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (iniciarHeader()) return;
    var ph = document.getElementById('header-placeholder');
    if (!ph) return;
    var mo = new MutationObserver(function () { if (iniciarHeader()) mo.disconnect(); });
    mo.observe(ph, { childList: true, subtree: true });
  });
})();
