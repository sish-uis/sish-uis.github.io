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

  // Normaliza nombres para reconocer a la misma persona en distintos periodos
  function tokens(n) {
    return String(n || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zñ ]/g, ' ').split(/\s+/).filter(Boolean);
  }
  function mismaPersona(a, b) {
    var ta = tokens(a), tb = tokens(b);
    if (!ta.length || !tb.length || ta[0] !== tb[0]) return false;
    if (ta.length === 1 || tb.length === 1) return ta.length === tb.length;
    return ta.slice(1).some(function (t) { return tb.indexOf(t) > 0; });
  }

  function tarjetaDireccion(p, idx) {
    var bio = p.descripcion && String(p.descripcion).trim();
    return '<article class="sish-lead' + (bio ? ' has-bio' : '') + '"' + (bio ? ' data-perfil="' + idx + '" tabindex="0" role="button"' : '') + '>' +
      avatar(p, 'sish-lead-photo') +
      '<div class="sish-lead-body"><span class="sish-role">' + esc(p.cargo || 'Dirección') + '</span><h3>' + esc(p.nombre) + '</h3>' +
      (bio ? '<p class="sish-lead-excerpt">' + esc(String(Array.isArray(p.descripcion) ? p.descripcion[0] : p.descripcion).split(/\n\s*\n/)[0]) + '</p>' : '') +
      '<div class="sish-lead-foot">' + contactos(p) + (bio ? '<span class="sish-more">Ver perfil <i class="fas fa-arrow-right"></i></span>' : '') + '</div>' +
      '</div></article>';
  }
  function tarjetaPersona(p, idx, desde) {
    var bio = p.descripcion && String(p.descripcion).trim();
    return '<article class="sish-person' + (p.foto ? '' : ' no-photo') + (bio ? ' has-bio' : '') + '"' +
      (bio ? ' data-perfil="' + idx + '" tabindex="0" role="button" aria-label="Ver perfil de ' + esc(p.nombre) + '"' : '') + '>' +
      avatar(p, 'sish-person-photo') +
      '<div class="sish-person-info">' + (p.cargo ? '<span class="sish-role">' + esc(p.cargo) + '</span>' : '') +
      '<h3>' + esc(p.nombre) + '</h3>' +
      (desde ? '<small class="sish-since"><i class="fas fa-tint"></i> En el SISH desde ' + esc(desde) + '</small>' : '') +
      '</div>' + (bio ? '<span class="sish-person-cta"><i class="fas fa-plus"></i></span>' : '') +
      '</article>';
  }
  function tarjetaCompacta(p, idx) {
    var bio = p.descripcion && String(p.descripcion).trim();
    return '<article class="sish-mini' + (bio ? ' has-bio' : '') + '"' + (bio ? ' data-perfil="' + idx + '" tabindex="0" role="button"' : '') + '>' +
      avatar(p, 'sish-mini-photo') + '<div><h3>' + esc(p.nombre) + '</h3>' + (p.cargo ? '<span class="sish-role">' + esc(p.cargo) + '</span>' : '') + '</div>' +
      contactos(p) + '</article>';
  }

  function renderEquipo(cont) {
    Promise.all([cargar('/data/integrantes.json'), cargar('/data/historial-equipo.json').catch(function () { return { periodos: [] }; })])
      .then(function (r) {
        var actual = r[0], hist = r[1];
        var periodos = [{ id: hist.actual || 'Actual', titulo: hist.actual || 'Actual', grupos: actual.grupos, actual: true }]
          .concat(hist.periodos || []);
        // Primer periodo (más antiguo) en que aparece cada persona
        var orden = periodos.slice().reverse();
        function desde(nombre) {
          for (var i = 0; i < orden.length; i++) {
            var hit = orden[i].grupos.some(function (g) { return g.miembros.some(function (m) { return mismaPersona(m.nombre, nombre); }); });
            if (hit) return orden[i].id;
          }
          return '';
        }
        function trayectoria(nombre) {
          return orden.filter(function (pe) {
            return pe.grupos.some(function (g) { return g.miembros.some(function (m) { return mismaPersona(m.nombre, nombre); }); });
          }).map(function (pe) { return pe.id; });
        }

        var barra = document.getElementById('equipo-periodos');
        var stats = document.getElementById('equipo-stats');
        var personas = [];

        function pintar(id) {
          var pe = periodos.filter(function (x) { return x.id === id; })[0] || periodos[0];
          personas = [];
          if (barra) barra.querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-p') === pe.id); b.setAttribute('aria-selected', b.getAttribute('data-p') === pe.id); });
          var total = 0, dir = 0;
          var html = pe.grupos.map(function (g, gi) {
            total += g.miembros.length;
            var tipo = gi === 0 ? 'dir' : (/extern|acompa/i.test(g.titulo) ? 'mini' : 'grid');
            if (tipo === 'dir') dir += g.miembros.length;
            var items = g.miembros.map(function (p) {
              var idx = personas.push(p) - 1;
              if (tipo === 'dir') return tarjetaDireccion(p, idx);
              if (tipo === 'mini') return tarjetaCompacta(p, idx);
              var d = desde(p.nombre);
              return tarjetaPersona(p, idx, d && d !== pe.id ? d : '');
            }).join('');
            return '<section class="sish-team-group is-' + tipo + '"><header class="sish-team-head"><h2>' + esc(g.titulo) + '</h2>' +
              (g.subtitulo ? '<p>' + esc(g.subtitulo) + '</p>' : '') + '<span class="sish-count">' + g.miembros.length + '</span></header>' +
              '<div class="sish-team-' + tipo + '">' + items + '</div></section>';
          }).join('');
          cont.innerHTML = html;
          if (stats) stats.innerHTML =
            '<div><b>' + total + '</b><span>Integrantes en ' + esc(pe.titulo) + '</span></div>' +
            '<div><b>' + dir + '</b><span>Docentes a cargo</span></div>' +
            '<div><b>' + periodos.length + '</b><span>Periodos registrados</span></div>';
        }

        if (barra) {
          barra.innerHTML = periodos.map(function (pe) {
            return '<button type="button" role="tab" data-p="' + esc(pe.id) + '">' + esc(pe.titulo) + (pe.actual ? '<small>Actual</small>' : '') + '</button>';
          }).join('');
          barra.addEventListener('click', function (e) {
            var b = e.target.closest('button[data-p]'); if (!b) return;
            history.replaceState(null, '', '#' + b.getAttribute('data-p'));
            pintar(b.getAttribute('data-p'));
          });
        }
        var inicial = decodeURIComponent((location.hash || '').slice(1));
        pintar(periodos.some(function (x) { return x.id === inicial; }) ? inicial : periodos[0].id);

        cont.addEventListener('click', function (e) {
          var copiar = e.target.closest('[data-copiar]');
          if (copiar) {
            e.stopPropagation();
            var mail = copiar.getAttribute('data-copiar');
            (navigator.clipboard ? navigator.clipboard.writeText(mail) : Promise.reject()).then(function () {
              copiar.classList.add('is-copied'); copiar.innerHTML = '<i class="fas fa-check"></i>';
              setTimeout(function () { copiar.classList.remove('is-copied'); copiar.innerHTML = '<i class="fas fa-envelope"></i>'; }, 1600);
            }).catch(function () { window.location.href = 'mailto:' + mail; });
            return;
          }
          if (e.target.closest('a')) return;
          var card = e.target.closest('[data-perfil]');
          if (!card) return;
          var p = personas[+card.getAttribute('data-perfil')];
          var tr = trayectoria(p.nombre);
          abrirModal(perfilHTML(p) + (tr.length ? '<div class="sish-profile-track"><span>Trayectoria en el SISH</span><div>' +
            tr.map(function (t) { return '<b>' + esc(t) + '</b>'; }).join('') + '</div></div>' : ''));
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
  var PROYECTOS = { 'jornadas-2026': { nombre: 'Jornadas 2026', url: '/jornadas-recurso-hidrico/' } };
  function marcarFechas(a) {
    a._anio = (a.fechaFin || '').slice(0, 4);
    a._prox = /^\d{4}-\d{2}-\d{2}$/.test(a.fechaFin || '') && new Date(a.fechaFin + 'T23:59:59') >= hoy();
    return a;
  }
  function articuloActividad(a) {
    marcarFechas(a);
    var proy = a.proyecto && PROYECTOS[a.proyecto];
    return '<article class="sish-act" data-y="' + a._anio + '" data-c="' + esc(a.categoria) + '">' +
      '<div class="sish-act-media">' + galeria(a) + '</div>' +
      '<div class="sish-act-body">' +
      '<div class="sish-act-tags"><span class="sish-tag"><i class="fas ' + icono(a.categoria) + '"></i> ' + esc(a.categoria) + '</span>' +
      (proy && location.pathname.indexOf(proy.url) !== 0 ? '<a class="sish-tag is-proj" href="' + proy.url + '"><i class="fas fa-tint"></i> ' + esc(proy.nombre) + '</a>' : '') +
      (a._prox ? '<span class="sish-tag is-soon"><i class="fas fa-clock"></i> Próximamente</span>' : '') + '</div>' +
      '<h3>' + esc(a.titulo) + '</h3>' +
      '<ul class="sish-meta">' +
      (a.fecha ? '<li><i class="far fa-calendar"></i>' + esc(a.fecha) + '</li>' : '') +
      (a.lugar ? '<li><i class="fas fa-map-marker-alt"></i>' + esc(a.lugar) + '</li>' : '') +
      (a.instructor ? '<li><i class="fas fa-user-tie"></i>' + esc(a.instructor) + '</li>' : '') +
      '</ul>' + parrafos(a.descripcion) +
      (a.enlace ? '<a class="btn btn-outline-primary btn-sm" href="' + esc(a.enlace) + '" target="_blank" rel="noopener">' + esc(a.enlace_texto || 'Ver más') + '</a>' : '') +
      '</div></article>';
  }
  function renderActividades(cont) {
    cargar('/data/actividades.json').then(function (data) {
      var acts = data.actividades.slice().sort(function (a, b) { return (b.fechaFin || '').localeCompare(a.fechaFin || ''); });
      var hoyD = hoy();
      var anios = [], cats = [];
      acts.forEach(function (a) {
        marcarFechas(a);
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

      var lista = acts.map(articuloActividad).join('');

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
  // Si en noticias.json hay "feedAutomatico" (URL de Behold), las 3 últimas
  // publicaciones salen solas. Si falla o está vacío, usa la lista "instagram".
  function fechaCorta(iso) {
    try { return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return ''; }
  }
  function tarjetaPost(p) {
    var sz = p.sizes || {};
    var img = (sz.medium && sz.medium.mediaUrl) || (sz.large && sz.large.mediaUrl) || p.thumbnailUrl || p.mediaUrl || '';
    var txt = String(p.prunedCaption || p.caption || '').replace(/\s+/g, ' ').trim();
    if (txt.length > 160) txt = txt.slice(0, 157).replace(/\s\S*$/, '') + '…';
    var video = /VIDEO/i.test(p.mediaType || '');
    return '<article class="sish-card sish-ig-card"><a class="sish-card-media" href="' + esc(p.permalink) + '" target="_blank" rel="noopener">' +
      (img ? '<img src="' + esc(img) + '" alt="Publicación de Instagram del SISH" loading="lazy">' : '') +
      '<span class="sish-cat"><i class="fab fa-instagram"></i> ' + (video ? 'Video' : 'Instagram') + '</span></a>' +
      '<div class="sish-card-body">' + (p.timestamp ? '<time>' + esc(fechaCorta(p.timestamp)) + '</time>' : '') +
      '<p>' + esc(txt) + '</p>' +
      '<a class="sish-link" href="' + esc(p.permalink) + '" target="_blank" rel="noopener">Ver en Instagram <i class="fas fa-arrow-right"></i></a></div></article>';
  }
  function renderEmbeds(cont, data) {
    var urls = (data.instagram || []).slice(0, 3);
    if (!urls.length) { cont.innerHTML = ''; return; }
    cont.classList.remove('sish-cards'); cont.classList.add('sish-ig-grid');
    cont.innerHTML = urls.map(function (u) {
      u = u.split('?')[0].replace(/\/?$/, '/');
      return '<div class="sish-ig-item"><blockquote class="instagram-media" data-instgrm-permalink="' + esc(u) +
        '?utm_source=ig_embed" data-instgrm-version="14"><a href="' + esc(u) + '" target="_blank" rel="noopener">Ver esta publicación en Instagram</a></blockquote></div>';
    }).join('');
    if (window.instgrm) { window.instgrm.Embeds.process(); return; }
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.instagram.com/embed.js';
    document.body.appendChild(s);
  }
  function renderInstagram(cont) {
    cargar('/data/noticias.json').then(function (data) {
      if (!data.feedAutomatico) return renderEmbeds(cont, data);
      return fetch(data.feedAutomatico).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (feed) {
          var posts = (feed.posts || []).slice(0, 3);
          if (!posts.length) throw new Error('feed vacío');
          cont.classList.remove('sish-ig-grid'); cont.classList.add('sish-cards');
          cont.innerHTML = posts.map(tarjetaPost).join('');
        })
        .catch(function (e) { console.warn('Feed automático no disponible, uso la lista manual:', e); renderEmbeds(cont, data); });
    }).catch(function (e) { console.error(e); error(cont, 'No se pudieron cargar las noticias.'); });
  }



  // ------------------------------------------------------------------
  // Portada: actividades recientes  →  <div id="actividades-recientes"></div>
  // ------------------------------------------------------------------
  function renderRecientes(cont) {
    cargar('/data/actividades.json').then(function (data) {
      var acts = data.actividades.filter(function (a) { return a.imagenes && a.imagenes.length && a.enPortada !== false; })
        .sort(function (a, b) { return (b.fechaFin || '').localeCompare(a.fechaFin || ''); }).slice(0, 3);
      cont.innerHTML = acts.map(function (a) {
        var proy = a.proyecto && PROYECTOS[a.proyecto];
        var url = proy ? proy.url : '/proyectos-extension/';
        var img = a.portada || a.imagenes[0];
        var resumen = Array.isArray(a.descripcion) ? a.descripcion[0] : String(a.descripcion || '').split(/\n\s*\n/)[0];
        return '<article class="sish-card reveal"><a class="sish-card-media" href="' + url + '">' +
          '<img src="' + esc(img) + '" alt="' + esc(a.titulo) + '" loading="lazy"><span class="sish-cat">' + esc(a.categoria) + '</span></a>' +
          '<div class="sish-card-body">' + (a.fecha ? '<time>' + esc(a.fecha) + '</time>' : '') +
          '<h3>' + esc(a.titulo) + '</h3><p>' + String(resumen || '').replace(/<[^>]+>/g, '') + '</p>' +
          '<a class="sish-link" href="' + url + '">Leer más <i class="fas fa-arrow-right"></i></a></div></article>';
      }).join('');
      if (window.sishReveal) window.sishReveal();
    }).catch(function (e) { console.error(e); error(cont, 'No se pudieron cargar las actividades.'); });
  }

  // ------------------------------------------------------------------
  // Portada: cifras  →  <b data-count="actividades|integrantes|webinarios|actas">
  // ------------------------------------------------------------------
  function contar(el, total) {
    var t0 = null, dur = 1400;
    function paso(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(total * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(paso);
    }
    requestAnimationFrame(paso);
  }
  function renderCifras(els) {
    var fuentes = {
      actividades: function () { return cargar('/data/actividades.json').then(function (d) { return d.actividades.length; }); },
      integrantes: function () { return cargar('/data/integrantes.json').then(function (d) { return d.grupos.reduce(function (n, g) { return n + g.miembros.length; }, 0); }); },
      webinarios: function () { return cargar('/data/webinarios.json').then(function (d) { return d.webinarios.length; }); },
      actas: function () { return cargar('/historial-actas/actas/historial.json').then(function (d) { return (d.actas || []).length; }); }
    };
    els.forEach(function (el) {
      var f = fuentes[el.getAttribute('data-count')];
      if (!f) return;
      f().then(function (n) {
        if (!('IntersectionObserver' in window)) { el.textContent = n; return; }
        var io = new IntersectionObserver(function (en) {
          if (en[0].isIntersecting) { contar(el, n); io.disconnect(); }
        }, { threshold: 0.5 });
        io.observe(el);
      }).catch(function () { var s = el.closest('.sish-stat'); if (s) s.style.display = 'none'; });
    });
  }

  // ------------------------------------------------------------------
  // Página del proyecto  →  <div id="proyecto-actividades" data-proyecto="jornadas-2026"></div>
  // ------------------------------------------------------------------
  function claveOrden(a) { var f = a.fechaFin || '9999'; return f.length === 4 ? f + '-99' : f; }
  function renderProyecto(cont) {
    var id = cont.getAttribute('data-proyecto');
    cargar('/data/actividades.json').then(function (data) {
      var acts = data.actividades.filter(function (a) { return a.proyecto === id; })
        .sort(function (a, b) { return claveOrden(a).localeCompare(claveOrden(b)); });
      var grupos = {};
      var orden = [];
      acts.forEach(function (a) {
        var g = a.tipoProducto || 'Actividades';
        if (!grupos[g]) { grupos[g] = []; orden.push(g); }
        grupos[g].push(a);
      });
      var n = 0;
      cont.innerHTML = orden.map(function (g) {
        return '<div class="sish-tl-group"><h3>' + esc(g) + '</h3></div><ol class="sish-timeline">' +
          grupos[g].map(function (a) {
            n++;
            return '<li class="sish-tl-item reveal"><span class="sish-tl-num">' + (n < 10 ? '0' : '') + n + '</span>' + articuloActividad(a) + '</li>';
          }).join('') + '</ol>';
      }).join('') || '<div class="sish-empty">Aún no hay actividades registradas para este proyecto.</div>';
      if (window.sishReveal) window.sishReveal();

      var info = (data.proyectos || {})[id] || {};
      var slot = document.getElementById('proyecto-video');
      if (slot && info.video) slot.outerHTML = videoLite({ id: info.video }, info.videoTitulo || 'Video del proyecto');
    }).catch(function (e) { console.error(e); error(cont, 'No se pudieron cargar las actividades del proyecto.'); });
  }


  // ------------------------------------------------------------------
  // Actas  →  #actas-archivo (historial) y #acta-ultima
  // ------------------------------------------------------------------
  var BASE_ACTAS = '/historial-actas/actas/';
  var MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  var DIAS = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  function infoActa(a) {
    var f = String(a.fecha).split('-'), d = new Date(+f[0], +f[1] - 1, +f[2]);
    return { a: a, y: +f[0], m: +f[1], d: +f[2], dia: DIAS[d.getDay()], mes: MESES[+f[1] - 1],
      sem: f[0] + '-' + (+f[1] <= 6 ? '1' : '2'), url: BASE_ACTAS + encodeURIComponent(a.archivo) };
  }
  function fechaLarga(i) { return i.dia + ' ' + i.d + ' de ' + i.mes + ' de ' + i.y; }
  function filaActa(i) {
    return '<article class="sish-acta-row" data-txt="' + esc((fechaLarga(i) + ' ' + i.a.nombre + ' ' + i.a.archivo).toLowerCase()) + '" data-y="' + i.y + '">' +
      '<div class="sish-acta-date"><b>' + (i.d < 10 ? '0' : '') + i.d + '</b><span>' + i.mes.slice(0, 3) + '</span><small>' + i.y + '</small></div>' +
      '<div class="sish-acta-info"><h3>Reunión del ' + esc(fechaLarga(i)) + '</h3><span><i class="far fa-file-pdf"></i> ' + esc(i.a.archivo) + '</span></div>' +
      '<div class="sish-acta-actions"><a href="' + i.url + '" target="_blank" rel="noopener" class="sish-icon-btn" title="Ver PDF"><i class="fas fa-eye"></i><span>Ver</span></a>' +
      '<a href="' + i.url + '" download class="sish-icon-btn is-ghost" title="Descargar PDF"><i class="fas fa-download"></i><span>Descargar</span></a></div></article>';
  }
  function cargarActas() {
    return cargar(BASE_ACTAS + 'historial.json').then(function (d) {
      return (d.actas || []).slice().sort(function (a, b) { return String(b.fecha).localeCompare(String(a.fecha)); }).map(infoActa);
    });
  }
  function renderActas(cont) {
    cargarActas().then(function (list) {
      if (!list.length) { cont.innerHTML = '<div class="sish-empty">Aún no hay actas registradas.</div>'; return; }
      var u = list[0];
      var dest = document.getElementById('acta-destacada');
      if (dest) dest.innerHTML = '<span class="sish-kicker">Última reunión</span><h2>' + esc(u.dia.charAt(0).toUpperCase() + u.dia.slice(1)) + ' ' + u.d + ' de ' + u.mes + ' de ' + u.y + '</h2>' +
        '<p>' + esc(u.a.nombre) + '</p><div class="sish-slide-actions"><a href="/ultima-acta/" class="btn btn-primary">Leer el acta <i class="fas fa-arrow-right ml-1"></i></a>' +
        '<a href="' + u.url + '" download class="btn btn-ghost"><i class="fas fa-download mr-1"></i> PDF</a></div>';
      var anios = []; list.forEach(function (i) { if (anios.indexOf(i.y) < 0) anios.push(i.y); });
      var sems = []; list.forEach(function (i) { if (sems.indexOf(i.sem) < 0) sems.push(i.sem); });
      var st = document.getElementById('actas-stats');
      if (st) st.innerHTML = '<div><b>' + list.length + '</b><span>Actas registradas</span></div><div><b>' + sems.length + '</b><span>Semestres</span></div>' +
        '<div><b>' + anios[anios.length - 1] + '</b><span>Primera acta</span></div>';
      var bar = document.getElementById('actas-anios');
      if (bar) bar.innerHTML = '<button class="sish-filter on" data-y="">Todas <span>' + list.length + '</span></button>' +
        anios.map(function (y) { return '<button class="sish-filter" data-y="' + y + '">' + y + ' <span>' + list.filter(function (i) { return i.y === y; }).length + '</span></button>'; }).join('');
      cont.innerHTML = sems.map(function (s) {
        var items = list.filter(function (i) { return i.sem === s; });
        return '<section class="sish-acta-group" data-sem="' + s + '"><header class="sish-team-head"><h2>Semestre ' + s + '</h2><span class="sish-count">' + items.length + '</span></header>' +
          '<div class="sish-acta-list">' + items.map(filaActa).join('') + '</div></section>';
      }).join('') + '<div class="sish-empty" id="actas-vacio" hidden>No hay actas que coincidan con la búsqueda.</div>';

      var y = '', q = '';
      function filtrar() {
        var n = 0;
        cont.querySelectorAll('.sish-acta-row').forEach(function (r) {
          var ok = (!y || r.getAttribute('data-y') === y) && (!q || q.split(/\s+/).every(function (w) { return r.getAttribute('data-txt').indexOf(w) >= 0; }));
          r.hidden = !ok; if (ok) n++;
        });
        cont.querySelectorAll('.sish-acta-group').forEach(function (g) { g.hidden = !g.querySelector('.sish-acta-row:not([hidden])'); });
        document.getElementById('actas-vacio').hidden = n > 0;
      }
      if (bar) bar.addEventListener('click', function (e) {
        var b = e.target.closest('[data-y]'); if (!b) return;
        bar.querySelectorAll('.sish-filter').forEach(function (x) { x.classList.toggle('on', x === b); });
        y = b.getAttribute('data-y'); filtrar();
      });
      var inp = document.getElementById('actas-buscar');
      if (inp) inp.addEventListener('input', function () { q = inp.value.toLowerCase().normalize('NFC').trim(); filtrar(); });
    }).catch(function (e) { console.error(e); error(cont, 'No se pudo cargar el historial de actas.'); });
  }
  function renderUltimaActa(cont) {
    cargarActas().then(function (list) {
      if (!list.length) { cont.innerHTML = '<div class="sish-empty">Aún no hay actas registradas.</div>'; return; }
      var u = list[0];
      cont.innerHTML = '<div class="sish-acta-head"><div class="sish-acta-date is-big"><b>' + (u.d < 10 ? '0' : '') + u.d + '</b><span>' + u.mes.slice(0, 3) + '</span><small>' + u.y + '</small></div>' +
        '<div class="sish-acta-head-info"><span class="sish-kicker">Última reunión registrada</span><h2>' + esc(u.dia.charAt(0).toUpperCase() + u.dia.slice(1)) + ' ' + u.d + ' de ' + u.mes + ' de ' + u.y + '</h2><p>' + esc(u.a.nombre) + ' · ' + esc(u.a.archivo) + '</p></div>' +
        '<div class="sish-acta-actions"><a href="' + u.url + '" target="_blank" rel="noopener" class="sish-icon-btn"><i class="fas fa-expand"></i><span>Pantalla completa</span></a>' +
        '<a href="' + u.url + '" download class="sish-icon-btn is-ghost"><i class="fas fa-download"></i><span>Descargar</span></a></div></div>' +
        '<div class="sish-pdf"><iframe src="' + u.url + '#view=FitH" title="Acta del ' + esc(fechaLarga(u)) + '"></iframe>' +
        '<a class="sish-pdf-mobile" href="' + u.url + '" target="_blank" rel="noopener"><i class="far fa-file-pdf"></i><strong>Abrir el acta en PDF</strong><span>' + esc(u.a.archivo) + '</span></a></div>' +
        '<div class="sish-acta-group"><header class="sish-team-head"><h2>Actas anteriores</h2></header><div class="sish-acta-list">' +
        list.slice(1, 5).map(filaActa).join('') + '</div><a href="/historial-actas/" class="sish-link mt-3">Ver todo el historial <i class="fas fa-arrow-right"></i></a></div>';
    }).catch(function (e) { console.error(e); error(cont, 'No se pudo cargar la última acta.'); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var el;
    if ((el = document.getElementById('actas-archivo'))) renderActas(el);
    if ((el = document.getElementById('acta-ultima'))) renderUltimaActa(el);
    if ((el = document.getElementById('actividades-recientes'))) renderRecientes(el);
    if ((el = document.getElementById('proyecto-actividades'))) renderProyecto(el);
    var cifras = document.querySelectorAll('[data-count]');
    if (cifras.length) renderCifras(cifras);
    if ((el = document.getElementById('noticias-instagram'))) renderInstagram(el);
    if ((el = document.getElementById('equipo'))) renderEquipo(el);
    if ((el = document.getElementById('actividades'))) renderActividades(el);
    if ((el = document.getElementById('webinarios'))) renderWebinarios(el);
    if ((el = document.getElementById('webinario-destacado'))) renderDestacado(el);
  });
})();
