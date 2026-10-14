// =====================================================================
// SISH · Contenido desde JSON
// Para actualizar la página NO toques este archivo: edita los .json
// de la carpeta /data/ (integrantes, actividades y webinarios).
// =====================================================================
(function () {
  'use strict';

  var cache = {};
  function cargar(ruta) {
    if (!cache[ruta]) {
      cache[ruta] = fetch(ruta, { cache: 'no-cache' }).then(function (r) {
        if (!r.ok) throw new Error(ruta + ' → ' + r.status);
        return r.json();
      });
    }
    return cache[ruta];
  }

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  // Párrafos: en los JSON se permite HTML simple (<b>, <i>, <a>)
  function parrafos(texto) {
    var lista = Array.isArray(texto) ? texto : String(texto || '').split(/\n\s*\n/);
    return lista.filter(function (p) { return p && p.trim(); })
      .map(function (p) { return '<p>' + p.replace(/\n/g, '<br>') + '</p>'; }).join('');
  }
  function iniciales(nombre) {
    var partes = String(nombre).trim().split(/\s+/);
    return ((partes[0] || '')[0] + ((partes[2] || partes[1] || '')[0] || '')).toUpperCase();
  }
  function error(cont, msg) {
    cont.innerHTML = '<div class="sish-empty"><i class="fas fa-exclamation-triangle"></i> ' + msg + '</div>';
  }
  function hoy() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }

  // ------------------------------------------------------------------
  // Ventana emergente (para perfiles)
  // ------------------------------------------------------------------
  var modal;
  function abrirModal(html) {
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'sish-modal';
      modal.innerHTML = '<div class="sish-modal-backdrop" data-cerrar></div>' +
        '<div class="sish-modal-box" role="dialog" aria-modal="true">' +
        '<button class="sish-modal-close" data-cerrar aria-label="Cerrar">&times;</button>' +
        '<div class="sish-modal-body"></div></div>';
      document.body.appendChild(modal);
      modal.addEventListener('click', function (e) { if (e.target.hasAttribute('data-cerrar')) cerrarModal(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrarModal(); });
    }
    modal.querySelector('.sish-modal-body').innerHTML = html;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.sish-modal-close').focus();
  }
  function cerrarModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // ------------------------------------------------------------------
  // Integrantes  →  <div id="equipo"></div>
  // ------------------------------------------------------------------
  function avatar(p, clase) {
    var ini = '<span class="sish-avatar-ini">' + esc(iniciales(p.nombre)) + '</span>';
    if (!p.foto) return '<div class="' + clase + ' is-empty">' + ini + '</div>';
    return '<div class="' + clase + '">' + ini +
      '<img src="' + esc(p.foto) + '" alt="' + esc(p.nombre) + '" loading="lazy" onerror="this.remove()"></div>';
  }
  function contactos(p) {
    var h = '';
    if (p.email) h += '<button type="button" class="sish-chip-btn" data-copiar="' + esc(p.email) + '" title="Copiar correo: ' + esc(p.email) + '"><i class="fas fa-envelope"></i></button>';
    if (p.cvlac) h += '<a class="sish-chip-btn" href="' + esc(p.cvlac) + '" target="_blank" rel="noopener" title="CvLAC"><i class="fas fa-file-alt"></i></a>';
    if (p.linkedin) h += '<a class="sish-chip-btn" href="' + esc(p.linkedin) + '" target="_blank" rel="noopener" title="LinkedIn"><i class="fab fa-linkedin-in"></i></a>';
    return h ? '<div class="sish-contact">' + h + '</div>' : '';
  }
  function perfilHTML(p) {
    return '<div class="sish-profile">' + avatar(p, 'sish-profile-photo') +
      '<div><span class="sish-role">' + esc(p.cargo) + '</span><h3>' + esc(p.nombre) + '</h3>' +
      (p.email ? '<p class="sish-profile-mail"><i class="fas fa-envelope"></i> ' + esc(p.email) + '</p>' : '') +
      contactos(p) + '</div></div>' +
      '<div class="sish-profile-bio">' + parrafos(p.descripcion) + '</div>';
  }

  function renderEquipo(cont) {
    cargar('/data/integrantes.json').then(function (data) {
      var personas = [];
      var html = data.grupos.map(function (g, gi) {
        var esDireccion = gi === 0;
        var cards = g.miembros.map(function (p) {
          var idx = personas.push(p) - 1;
          var tieneBio = p.descripcion && p.descripcion.trim();
          if (esDireccion) {
            return '<div class="col-md-6 mb-4"><article class="sish-lead-card">' + avatar(p, 'sish-lead-photo') +
              '<div class="sish-lead-info"><span class="sish-role">' + esc(p.cargo) + '</span><h3>' + esc(p.nombre) + '</h3>' +
              '<div class="sish-lead-bio">' + parrafos(p.descripcion) + '</div>' + contactos(p) + '</div></article></div>';
          }
          return '<div class="col-6 col-md-4 col-xl-3 mb-4"><article class="sish-member' + (tieneBio ? ' has-bio' : '') + '"' +
            (tieneBio ? ' data-perfil="' + idx + '" tabindex="0" role="button" aria-label="Ver perfil de ' + esc(p.nombre) + '"' : '') + '>' +
            avatar(p, 'sish-member-photo') +
            '<div class="sish-member-info"><h3>' + esc(p.nombre) + '</h3><span class="sish-role">' + esc(p.cargo) + '</span>' +
            contactos(p) + (tieneBio ? '<span class="sish-more">Ver perfil <i class="fas fa-arrow-right"></i></span>' : '') +
            '</div></article></div>';
        }).join('');
        return '<div class="sish-group"><div class="sish-group-head"><h2>' + esc(g.titulo) + '</h2>' +
          (g.subtitulo ? '<p>' + esc(g.subtitulo) + '</p>' : '') +
          '<span class="sish-count">' + g.miembros.length + '</span></div><div class="row">' + cards + '</div></div>';
      }).join('');
      cont.innerHTML = html;

      cont.addEventListener('click', function (e) {
        var copiar = e.target.closest('[data-copiar]');
        if (copiar) {
          e.stopPropagation();
          var mail = copiar.getAttribute('data-copiar');
          (navigator.clipboard ? navigator.clipboard.writeText(mail) : Promise.reject()).then(function () {
            copiar.classList.add('is-copied');
            copiar.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(function () { copiar.classList.remove('is-copied'); copiar.innerHTML = '<i class="fas fa-envelope"></i>'; }, 1600);
          }).catch(function () { window.location.href = 'mailto:' + mail; });
          return;
        }
        if (e.target.closest('a')) return;
        var card = e.target.closest('[data-perfil]');
        if (card) abrirModal(perfilHTML(personas[+card.getAttribute('data-perfil')]));
      });
      cont.addEventListener('keydown', function (e) {
        var card = e.target.closest('[data-perfil]');
        if (card && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); card.click(); }
      });
    }).catch(function (e) { console.error(e); error(cont, 'No se pudo cargar el equipo.'); });
  }

  // ------------------------------------------------------------------
  // Galería simple (sin dependencias)
  // ------------------------------------------------------------------
  var iconos = { 'Charla': 'fa-chalkboard-teacher', 'Taller': 'fa-tools', 'Curso': 'fa-laptop-code', 'Salida de campo': 'fa-hiking',
    'Conversatorio': 'fa-comments', 'Congreso': 'fa-award', 'Evento': 'fa-star', 'Publicación': 'fa-book-open' };
  function icono(cat) { return iconos[cat] || 'fa-tint'; }

  function galeria(a) {
    var items = (a.imagenes || []).map(function (src) {
      return '<img src="' + esc(src) + '" alt="' + esc(a.titulo) + '" loading="lazy">';
    }).concat((a.videos || []).map(function (src) {
      return '<video src="' + esc(src) + '" controls preload="metadata" playsinline></video>';
    }));
    if (!items.length) {
      return '<div class="sish-gallery is-empty"><i class="fas ' + icono(a.categoria) + '"></i><span>Fotos próximamente</span></div>';
    }
    var nav = items.length > 1 ?
      '<button class="sish-gal-btn prev" aria-label="Anterior"><i class="fas fa-chevron-left"></i></button>' +
      '<button class="sish-gal-btn next" aria-label="Siguiente"><i class="fas fa-chevron-right"></i></button>' +
      '<div class="sish-gal-dots">' + items.map(function (_, i) { return '<span' + (i ? '' : ' class="on"') + '></span>'; }).join('') + '</div>' : '';
    return '<div class="sish-gallery" data-i="0">' + items.map(function (it, i) {
      return '<div class="sish-gal-item' + (i ? '' : ' on') + '">' + it + '</div>';
    }).join('') + nav + '</div>';
  }
  function moverGaleria(gal, paso) {
    var items = gal.querySelectorAll('.sish-gal-item'), dots = gal.querySelectorAll('.sish-gal-dots span');
    var i = (+gal.getAttribute('data-i') + paso + items.length) % items.length;
    items.forEach(function (el, k) {
      el.classList.toggle('on', k === i);
      var v = el.querySelector('video'); if (v && k !== i) v.pause();
    });
    dots.forEach(function (el, k) { el.classList.toggle('on', k === i); });
    gal.setAttribute('data-i', i);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.sish-gal-btn');
    if (b) moverGaleria(b.closest('.sish-gallery'), b.classList.contains('next') ? 1 : -1);
  });

  // ------------------------------------------------------------------
  // Actividades  →  <div id="actividades"></div>
  // ------------------------------------------------------------------
  function renderActividades(cont) {
    cargar('/data/actividades.json').then(function (data) {
      var acts = data.actividades.slice().sort(function (a, b) { return (b.fechaFin || '').localeCompare(a.fechaFin || ''); });
      var hoyD = hoy();
      var anios = [], cats = [];
      acts.forEach(function (a) {
        a._anio = (a.fechaFin || '').slice(0, 4);
        a._prox = a.fechaFin && new Date(a.fechaFin + 'T23:59:59') >= hoyD;
        if (a._anio && anios.indexOf(a._anio) < 0) anios.push(a._anio);
        if (a.categoria && cats.indexOf(a.categoria) < 0) cats.push(a.categoria);
      });

      var intro = document.getElementById('actividades-intro');
      if (intro && data.intro) intro.innerHTML = parrafos(data.intro);

      var d = data.destacado;
      var destacado = d ? '<article class="sish-act sish-act-featured">' +
        '<div class="sish-act-media">' + galeria(d) + '</div><div class="sish-act-body">' +
        '<span class="sish-kicker">Siempre disponible</span><h3>' + esc(d.titulo) + '</h3>' + parrafos(d.descripcion) +
        (d.enlace ? '<a class="btn btn-primary btn-sm" href="' + esc(d.enlace) + '">' + esc(d.enlace_texto || 'Ver más') + ' <i class="fas fa-arrow-right ml-1"></i></a>' : '') +
        '</div></article>' : '';

      var filtros = '<div class="sish-filters" role="toolbar" aria-label="Filtrar actividades">' +
        '<button class="sish-filter on" data-f="*">Todas <span>' + acts.length + '</span></button>' +
        anios.map(function (y) { return '<button class="sish-filter" data-f="y:' + y + '">' + y + '</button>'; }).join('') +
        '<span class="sish-filter-sep"></span>' +
        cats.map(function (c) { return '<button class="sish-filter" data-f="c:' + esc(c) + '"><i class="fas ' + icono(c) + '"></i> ' + esc(c) + '</button>'; }).join('') +
        '</div>';

      var lista = acts.map(function (a) {
        return '<article class="sish-act" data-y="' + a._anio + '" data-c="' + esc(a.categoria) + '">' +
          '<div class="sish-act-media">' + galeria(a) + '</div>' +
          '<div class="sish-act-body">' +
          '<div class="sish-act-tags"><span class="sish-tag"><i class="fas ' + icono(a.categoria) + '"></i> ' + esc(a.categoria) + '</span>' +
          (a._prox ? '<span class="sish-tag is-soon"><i class="fas fa-clock"></i> Próximamente</span>' : '') + '</div>' +
          '<h3>' + esc(a.titulo) + '</h3>' +
          '<ul class="sish-meta">' +
          (a.fecha ? '<li><i class="far fa-calendar"></i>' + esc(a.fecha) + '</li>' : '') +
          (a.lugar ? '<li><i class="fas fa-map-marker-alt"></i>' + esc(a.lugar) + '</li>' : '') +
          (a.instructor ? '<li><i class="fas fa-user-tie"></i>' + esc(a.instructor) + '</li>' : '') +
          '</ul>' + parrafos(a.descripcion) +
          (a.enlace ? '<a class="btn btn-outline-primary btn-sm" href="' + esc(a.enlace) + '" target="_blank" rel="noopener">Ver más</a>' : '') +
          '</div></article>';
      }).join('');

      cont.innerHTML = destacado + filtros + '<div class="sish-act-list">' + lista + '</div>';

      cont.querySelector('.sish-filters').addEventListener('click', function (e) {
        var b = e.target.closest('.sish-filter'); if (!b) return;
        cont.querySelectorAll('.sish-filter').forEach(function (x) { x.classList.toggle('on', x === b); });
        var f = b.getAttribute('data-f');
        cont.querySelectorAll('.sish-act-list .sish-act').forEach(function (el) {
          var ok = f === '*' || (f.indexOf('y:') === 0 && el.getAttribute('data-y') === f.slice(2)) ||
            (f.indexOf('c:') === 0 && el.getAttribute('data-c') === f.slice(2));
          el.hidden = !ok;
        });
      });
    }).catch(function (e) { console.error(e); error(cont, 'No se pudieron cargar las actividades.'); });
  }

  // ------------------------------------------------------------------
  // Webinarios  →  <div id="webinarios"></div>  y  <div id="webinario-destacado"></div>
  // ------------------------------------------------------------------
  function videoLite(v, titulo) {
    return '<div class="sish-yt" data-yt="' + esc(v.id) + '" data-title="' + esc(titulo) + '">' +
      '<img src="https://i.ytimg.com/vi/' + esc(v.id) + '/hqdefault.jpg" alt="" loading="lazy" onerror="this.style.visibility=\'hidden\'">' +
      '<button class="sish-yt-play" aria-label="Reproducir ' + esc(titulo) + '"><i class="fas fa-play"></i></button></div>';
  }
  document.addEventListener('click', function (e) {
    var yt = e.target.closest('.sish-yt');
    if (!yt || yt.classList.contains('is-on')) return;
    yt.classList.add('is-on');
    yt.innerHTML = '<iframe src="https://www.youtube.com/embed/' + yt.getAttribute('data-yt') + '?autoplay=1&rel=0" title="' +
      yt.getAttribute('data-title') + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
  });

  function bloqueWebinario(w, compacto) {
    var vids = (compacto ? w.videos.slice(0, 1) : w.videos).map(function (v) {
      return (v.titulo && !compacto ? '<h4 class="sish-video-title"><i class="fas fa-play-circle"></i> ' + esc(v.titulo) + '</h4>' : '') + videoLite(v, v.titulo || w.titulo);
    }).join('');
    return '<article class="sish-webinar' + (compacto ? ' is-compact' : '') + '"><div class="sish-webinar-media">' + vids + '</div>' +
      '<div class="sish-webinar-body">' + (compacto ? '<span class="sish-kicker">Webinario destacado</span>' : '') +
      '<h3>' + esc(w.titulo) + '</h3>' + parrafos(compacto ? w.descripcion.slice(0, 1) : w.descripcion) +
      (w.expositores ? '<p class="sish-speakers"><i class="fas fa-microphone"></i> <strong>Expositores:</strong> ' + esc(w.expositores) + '</p>' : '') +
      (compacto ? '<a href="/webinarios/" class="btn btn-primary">Ver todos los webinarios</a>' : '') +
      '</div></article>';
  }

  function renderWebinarios(cont) {
    cargar('/data/webinarios.json').then(function (data) {
      var intro = document.getElementById('webinarios-intro');
      if (intro && data.intro) intro.innerHTML = parrafos(data.intro);
      cont.innerHTML = data.webinarios.map(function (w) { return bloqueWebinario(w, false); }).join('');
    }).catch(function (e) { console.error(e); error(cont, 'No se pudieron cargar los webinarios.'); });
  }
  function renderDestacado(cont) {
    cargar('/data/webinarios.json').then(function (data) {
      if (data.webinarios[0]) cont.innerHTML = bloqueWebinario(data.webinarios[0], true);
    }).catch(function (e) { console.error(e); });
  }

  // ------------------------------------------------------------------
  // Noticias de Instagram  →  <div id="noticias-instagram"></div>
  // ------------------------------------------------------------------
  function renderInstagram(cont) {
    cargar('/data/noticias.json').then(function (data) {
      var urls = (data.instagram || []).slice(0, 3);
      if (!urls.length) { cont.innerHTML = ''; return; }
      cont.innerHTML = urls.map(function (u) {
        u = u.split('?')[0].replace(/\/?$/, '/');
        return '<div class="sish-ig-item"><blockquote class="instagram-media" data-instgrm-permalink="' + esc(u) +
          '?utm_source=ig_embed" data-instgrm-version="14"><a href="' + esc(u) + '" target="_blank" rel="noopener">Ver esta publicación en Instagram</a></blockquote></div>';
      }).join('');
      if (window.instgrm) { window.instgrm.Embeds.process(); return; }
      var s = document.createElement('script');
      s.async = true; s.src = 'https://www.instagram.com/embed.js';
      document.body.appendChild(s);
    }).catch(function (e) { console.error(e); error(cont, 'No se pudieron cargar las noticias.'); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var el;
    if ((el = document.getElementById('noticias-instagram'))) renderInstagram(el);
    if ((el = document.getElementById('equipo'))) renderEquipo(el);
    if ((el = document.getElementById('actividades'))) renderActividades(el);
    if ((el = document.getElementById('webinarios'))) renderWebinarios(el);
    if ((el = document.getElementById('webinario-destacado'))) renderDestacado(el);
  });
})();
