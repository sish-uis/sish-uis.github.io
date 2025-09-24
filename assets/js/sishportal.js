document.addEventListener("DOMContentLoaded", () => {
  // --- Cargar Header ---
  fetch('/common/header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-placeholder').innerHTML = data;
    })
    .catch(err => console.error('Error cargando header:', err));

  // --- Cargar Footer ---
  fetch('/common/footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer-placeholder').innerHTML = data;
    })
    .catch(err => console.error('Error cargando footer:', err));

// Cargar equipo (cards de integrantes)
function cargarEquipo(ruta, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;

  fetch(ruta)
    .then(response => response.json())
    .then(data => {
      data.forEach(persona => {
        const card = document.createElement("div");
        card.className = "col-12 mb-4";

        const descripcionHTML = persona.descripcion
          .replace(/\n\n/g, '<br><br>')
          .replace(/\n/g, '<br>');

        card.innerHTML = `
          <div class="card shadow-sm h-100">
            <div class="row g-0">
              <!-- Columna foto + contacto -->
              <div class="col-md-5 d-flex flex-column align-items-center p-3">
                <img src="${persona.foto}" class="img-fluid rounded mb-2" alt="${persona.nombre}" style="width: 180px; height: auto;">
                <h6 class="card-title mb-3">Datos de contacto</h6>
                <div class="d-flex justify-content-center mb-4" style="gap: 20px;">
                  ${persona.links?.cvlac ? `<a href="${persona.links.cvlac}" target="_blank" title="CvLAC" class="text-primary">
                    <i class="fas fa-file-alt" style="font-size: 1.5rem;"></i></a>` : ""}
                  ${persona.links?.linkedin ? `<a href="${persona.links.linkedin}" target="_blank" title="LinkedIn" class="text-primary">
                    <i class="fab fa-linkedin" style="font-size: 1.5rem;"></i></a>` : ""}
                </div>
                ${persona.links?.email ? `<div class="d-flex align-items-center">
                    <i class="fas fa-envelope text-primary" style="font-size: 1.5rem; cursor:pointer; margin-right:10px;" 
                       title="Copiar correo" onclick="navigator.clipboard.writeText('${persona.links.email}')"></i>
                    <span>${persona.links.email}</span>
                  </div>` : ""}
              </div>
              <!-- Columna info -->
              <div class="col-md-7">
                <div class="card-body">
                  <h5 class="card-title mb-3">${persona.nombre}</h5>
                  <h6 class="card-subtitle mb-3 text-muted">${persona.cargo}</h6>
                  <p class="card-text" style="text-align: justify; margin-top:0;">${descripcionHTML}</p>
                </div>
              </div>
            </div>
          </div>
        `;
        contenedor.appendChild(card);
      });
    })
    .catch(error => console.error(`Error cargando ${ruta}:`, error));
}

// ===== Renderizar Formulario de Acta =====
function renderFormularioActa(contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;

  contenedor.innerHTML = `
    <form>
      <!-- Número, fecha, hora y lugar -->
      <div class="form-row">
        <div class="form-group col-md-3">
          <label for="numeroActa"><b>Número de Acta</b></label>
          <input type="text" class="form-control" id="numeroActa" readonly>
        </div>
        <div class="form-group col-md-3">
          <label for="fecha"><b>Fecha</b></label>
          <input type="date" class="form-control" id="fecha">
        </div>
        <div class="form-group col-md-3">
          <label for="hora"><b>Hora</b></label>
          <input type="time" class="form-control" id="hora">
        </div>
        <div class="form-group col-md-3">
          <label for="lugar"><b>Lugar</b></label>
          <input type="text" class="form-control" id="lugar" placeholder="Ej: Sala de reuniones JBV">
        </div>
      </div>

      <!-- Asistentes -->
      <div class="form-group">
        <label><b>Asistentes</b></label>
        <div id="asistentes" class="row"></div>
        <div class="input-group mt-2 mb-2">
  <input type="text" class="form-control" id="nuevoAsistente" placeholder="Nombre de asistente externo">
  <div class="input-group-append">
    <button type="button" id="addAsistente" class="btn btn-outline-primary" title="Agregar asistente externo">
      <i class="fas fa-plus"></i>
    </button>
  </div>
</div>

      </div>

      <!-- Temas a tratar -->
      <div class="form-group">
        <label><b>Temas a tratar</b></label>
        <ul id="temasList" class="list-group mb-2"></ul>
        <div class="input-group">
          <input type="text" class="form-control" id="nuevoTema" placeholder="Escribe un tema...">
          <div class="input-group-append">
            <button type="button" id="addTema" class="btn btn-outline-primary" title="Agregar tema">
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Descripción, Compromisos y Observaciones -->
      <div class="form-group">
        <label for="descripcion"><b>Descripción de la reunión</b></label>
        <textarea class="form-control" id="descripcion" rows="5"></textarea>
      </div>
      <div class="form-group">
        <label for="compromisos"><b>Compromisos</b></label>
        <textarea class="form-control" id="compromisos" rows="3"></textarea>
      </div>
      <div class="form-group">
        <label for="observaciones"><b>Observaciones Generales</b></label>
        <textarea class="form-control" id="observaciones" rows="3"></textarea>
      </div>

      <!-- Anexos -->
      <div class="form-group">
        <label for="anexos"><b>Anexos (imágenes)</b></label>
        <input type="file" class="form-control-file" id="anexos" accept="image/*" multiple>
        <div id="preview" class="d-flex flex-wrap mt-3" style="gap:10px;"></div>
      </div>

      <!-- Botón Generar PDF -->
      <div class="form-group mt-3">
        <button type="button" id="generarPdf" class="btn btn-success">
          <i class="fas fa-file-pdf"></i> Generar Acta PDF
        </button>
      </div>
    </form>
  `;

  // ===== Autogenerar número de acta =====
  const fechaInput = contenedor.querySelector("#fecha");
  const numeroInput = contenedor.querySelector("#numeroActa");
  if (fechaInput && numeroInput) {
    fechaInput.addEventListener("change", () => {
      const fecha = new Date(fechaInput.value);
      if (!isNaN(fecha)) {
        const dd = String(fecha.getDate()).padStart(2, "0");
        const mm = String(fecha.getMonth() + 1).padStart(2, "0");
        const yyyy = fecha.getFullYear();
        numeroInput.value = `${dd}${mm}${yyyy}`;
      }
    });
  }

  // ===== Cargar asistentes =====
  fetch("/generar-acta/asistentes.json")
    .then(res => res.json())
    .then(lista => {
      const asistentesDiv = contenedor.querySelector("#asistentes");
      lista.forEach(persona => {
        const div = document.createElement("div");
        div.className = "form-check col-md-6"; // <- dos columnas
        div.innerHTML = `
          <input class="form-check-input" type="checkbox" value="${persona.nombre}" id="chk-${persona.nombre.replace(/\s+/g,'-')}">
          <label class="form-check-label" for="chk-${persona.nombre.replace(/\s+/g,'-')}">${persona.nombre}</label>
        `;
        asistentesDiv.appendChild(div);
      });
    })
    .catch(err => console.error("Error cargando asistentes:", err));

const nuevoAsistenteInput = contenedor.querySelector("#nuevoAsistente");
const addAsistenteBtn = contenedor.querySelector("#addAsistente");

function addAsistente(nombre) {
  if (!nombre.trim()) return;

  const asistentesDiv = contenedor.querySelector("#asistentes");
  const div = document.createElement("div");
  div.className = "form-check col-md-6 d-flex align-items-center justify-content-between";
  const id = `chk-${nombre.replace(/\s+/g,'-')}`;

  div.innerHTML = `
    <div class="d-flex align-items-center">
      <input class="form-check-input" type="checkbox" value="${nombre}" id="${id}" checked>
      <label class="form-check-label ml-2" for="${id}">${nombre} (Externo)</label>
    </div>
    <div>
      <button type="button" class="btn btn-sm btn-outline-warning mr-1" title="Editar"><i class="fas fa-edit"></i></button>
      <button type="button" class="btn btn-sm btn-outline-danger" title="Eliminar"><i class="fas fa-times"></i></button>
    </div>
  `;

  // Botón editar
  div.querySelector(".btn-outline-warning").addEventListener("click", () => {
    const nuevoNombre = prompt("Editar nombre del asistente:", nombre);
    if (nuevoNombre && nuevoNombre.trim()) {
      nombre = nuevoNombre.trim();
      div.querySelector("label").textContent = `${nombre} (externo)`;
      div.querySelector("input").value = nombre;
    }
  });

  // Botón eliminar
  div.querySelector(".btn-outline-danger").addEventListener("click", () => {
    div.remove();
  });

  asistentesDiv.appendChild(div);
  nuevoAsistenteInput.value = "";
}

// Eventos
addAsistenteBtn?.addEventListener("click", () => addAsistente(nuevoAsistenteInput.value));
nuevoAsistenteInput?.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    addAsistente(nuevoAsistenteInput.value);
  }
});


  // ===== Manejar Temas a Tratar =====
  const temasList = contenedor.querySelector("#temasList");
  const nuevoTemaInput = contenedor.querySelector("#nuevoTema");
  const addTemaBtn = contenedor.querySelector("#addTema");

  function addTema(texto) {
    if (!texto.trim()) return;
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <span>${temasList.children.length + 1}. ${texto}</span>
      <div>
        <button type="button" class="btn btn-sm btn-outline-warning mr-2" title="Editar"><i class="fas fa-edit"></i></button>
        <button type="button" class="btn btn-sm btn-outline-danger" title="Eliminar"><i class="fas fa-trash"></i></button>
      </div>
    `;
    // Editar
    li.querySelector(".btn-outline-warning").addEventListener("click", () => {
      const nuevoTexto = prompt("Editar tema:", texto);
      if (nuevoTexto) {
        texto = nuevoTexto;
        li.querySelector("span").textContent = `${Array.from(temasList.children).indexOf(li)+1}. ${texto}`;
      }
    });
    // Eliminar
    li.querySelector(".btn-outline-danger").addEventListener("click", () => {
      li.remove();
      Array.from(temasList.children).forEach((item, idx) => {
        const span = item.querySelector("span");
        span.textContent = `${idx + 1}. ${span.textContent.split(". ")[1]}`;
      });
    });
    temasList.appendChild(li);
    nuevoTemaInput.value = "";
  }

  addTemaBtn?.addEventListener("click", () => addTema(nuevoTemaInput.value));
  nuevoTemaInput?.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTema(nuevoTemaInput.value);
    }
  });

  // ===== Vista previa de anexos =====
  const anexosInput = contenedor.querySelector("#anexos");
  const preview = contenedor.querySelector("#preview");
  anexosInput?.addEventListener("change", () => {
    preview.innerHTML = "";
    Array.from(anexosInput.files).forEach(file => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = e => {
          const card = document.createElement("div");
          card.className = "position-relative";
          card.style.width = "120px";
          card.innerHTML = `
            <img src="\${e.target.result}" class="img-thumbnail" style="width:100%;height:auto;object-fit:cover;">
            <button type="button" class="btn btn-sm btn-outline-danger position-absolute" 
              style="top:5px;right:5px;border-radius:50%;" title="Eliminar imagen">
              <i class="fas fa-times"></i>
            </button>
          `;
          card.querySelector("button").addEventListener("click", () => card.remove());
          preview.appendChild(card);
        };
        reader.readAsDataURL(file);
      }
    });
  });

  // ===== Botón generar PDF =====
  const generarBtn = contenedor.querySelector("#generarPdf");
  generarBtn?.addEventListener("click", generarPDF);
}

async function generarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "letter" });

  const headerFooterMargin = 20;
  const extraMargin = 2;
  const contentMargin = 30;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const usableWidth = pageWidth - contentMargin * 2;
  const bottomLimit = pageHeight - headerFooterMargin - extraMargin - 15;

  const numero = document.getElementById("numeroActa")?.value || "";
  const fecha = document.getElementById("fecha")?.value || "";
  const hora = document.getElementById("hora")?.value || "";
  const lugar = document.getElementById("lugar")?.value || "";
  const descripcion = document.getElementById("descripcion")?.value || "";
  const compromisos = document.getElementById("compromisos")?.value || "";
  const observaciones = document.getElementById("observaciones")?.value || "";

  const asistentes = Array.from(document.querySelectorAll("#asistentes input:checked"))
    .map(chk => chk.nextElementSibling?.textContent || chk.value);

  const temas = Array.from(document.querySelectorAll("#temasList li span"))
    .map(span => span.textContent);

  const getBase64Image = async url => {
    try {
      return await new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const ext = url.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
          resolve(canvas.toDataURL(ext));
        };
        img.onerror = () => reject();
        img.src = url;
      });
    } catch {
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAuMBgD0Xn1UAAAAASUVORK5CYII=";
    }
  };

  const logoURL = "https://sish-uis.github.io/assets/img/actas/SISH.jpg";
  const uisURL = "https://sish-uis.github.io/assets/img/actas/UIS.jpg";
  const gigbaURL = "https://sish-uis.github.io/assets/img/actas/GIGBA.png";

  const logo = await getBase64Image(logoURL);
  const uis = await getBase64Image(uisURL);
  const gigba = await getBase64Image(gigbaURL);

  let pageNum = 1;
  let y = contentMargin;
  const lineHeight = 7;
  const sectionSpacing = 7; // espacio uniforme antes de subtítulos

  const addHeader = () => {
    const logoHeight = 19.6;
    const logoWidth = (93.9 / 24.6) * logoHeight;
    const logoX = pageWidth - logoWidth - 10;
    const logoY = (headerFooterMargin - logoHeight) / 2 + extraMargin;
    doc.addImage(logo, "JPEG", logoX, logoY, logoWidth, logoHeight);
  };

  const addFooter = () => {
    const uisWidth = 28.8, uisHeight = 14;
    const gigbaWidth = 15.4, gigbaHeight = 15.6;
    const space = 5;
    const maxLogoHeight = Math.max(uisHeight, gigbaHeight);
    const pieY = pageHeight - headerFooterMargin + (headerFooterMargin - maxLogoHeight) / 2 - extraMargin;

    doc.addImage(uis, "JPEG", 10, pieY, uisWidth, uisHeight);
    doc.addImage(gigba, "PNG", 10 + uisWidth + space, pieY, gigbaWidth, gigbaHeight);

    const footerText = [
      "Universidad Industrial de Santander",
      "Bucaramanga, Colombia",
      "https://sish-uis.github.io/",
      "semillerohidrosistemas@gmail.com",
      "@sish_uis"
    ];

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    footerText.forEach((line, i) => {
      doc.text(line, pageWidth - 10, pieY + 3 + i * 3.5 - extraMargin, { align: "right" });
    });

    doc.setFontSize(8);
    doc.text(`Página | ${pageNum}`, pageWidth - 10, pageHeight / 2, { align: "right" });
  };

  const addText = (textArr, x = contentMargin, lh = 5) => {
    textArr.forEach(line => {
      if (y + lh > bottomLimit) {
        addFooter();
        doc.addPage();
        pageNum++;
        addHeader();
        y = contentMargin;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
      }
      doc.text(line, x, y);
      y += lh;
    });
  };

  addHeader();

  // Título centrado
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  const titleText = `Acta No. ${numero}`;
  const titleX = (pageWidth - doc.getTextWidth(titleText)) / 2;
  addText([titleText], titleX, 12);

  // Fecha / Hora / Lugar
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  const infoData = [["Fecha:", fecha], ["Hora:", hora], ["Lugar:", lugar]];
  infoData.forEach(([label, value]) => {
    addText([`${label} ${value || "—"}`], contentMargin, lineHeight);
  });
  y += 5;

  // Asistentes
  doc.setFont("helvetica", "bold");
  addText(["Asistentes:"], contentMargin, lineHeight);
  doc.setFont("helvetica", "normal");
  if (asistentes.length > 0) {
    asistentes.forEach(a => addText([`• ${a}`], contentMargin + 5, lineHeight));
  } else {
    addText(["Ninguno"], contentMargin + 5, lineHeight);
  }
  y += 5;

  // Temas a tratar
  doc.setFont("helvetica", "bold");
  addText(["Temas a Tratar:"], contentMargin, lineHeight);
  doc.setFont("helvetica", "normal");
  if (temas.length > 0) {
    temas.forEach((t, i) => addText([`${i + 1}. ${t.replace(/^\d+\.\s*/, "")}`], contentMargin + 5, lineHeight));
  } else {
    addText(["Ninguno"], contentMargin + 5, lineHeight);
  }
  y += 5;

  // Secciones con espaciado uniforme
  const sections = [
    { title: "Descripción de la reunión:", content: descripcion },
    { title: "Compromisos:", content: compromisos },
    { title: "Observaciones Generales:", content: observaciones }
  ];

  sections.forEach(sec => {
    y += sectionSpacing; // espaciado uniforme antes de cada subtítulo
    doc.setFont("helvetica", "bold");
    addText([sec.title], contentMargin, lineHeight);
    doc.setFont("helvetica", "normal");
    addText(doc.splitTextToSize(sec.content, usableWidth), contentMargin, 5);
  });

  addFooter();

  doc.save(`Acta-${numero || fecha}.pdf`);
}



// --- Ejecutar solo si existe el contenedor ---
if (document.getElementById("formulario-acta")) {
  renderFormularioActa("formulario-acta");
}

  // --- Cargar docentes y estudiantes ---
  cargarEquipo("/nuestra-gente/docentes.json", "docentes");
  cargarEquipo("/nuestra-gente/estudiantes.json", "estudiantes");
});

document.addEventListener("DOMContentLoaded", () => {
  const historialContenedor = document.getElementById("historial-actas");
  if (!historialContenedor) return;

  const base = "actas/"; // relativo a /historial-actas/

  fetch(`${base}historial.json`)
    .then(r => r.json())
    .then(data => {
      if (!data.actas || data.actas.length === 0) {
        historialContenedor.innerHTML = "<p>No hay actas registradas.</p>";
        return;
      }

      // Ordenar por fecha descendente
      data.actas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      data.actas.forEach(acta => {
        const fechaBonita = new Date(acta.fecha).toLocaleDateString("es-ES", {
          weekday: "long", day: "numeric", month: "long", year: "numeric"
        });

        const item = document.createElement("div");
        item.className = "list-group-item d-flex justify-content-between align-items-center";
        item.innerHTML = `
          <div>
            <div style="font-weight:600">${fechaBonita}</div>
            <small class="text-muted">${acta.nombre}</small>
          </div>
          <div class="btn-group">
            <a href="${base + acta.nombre}" target="_blank" class="btn btn-sm btn-primary">Ver PDF</a>
            <a href="${base + acta.nombre}" download class="btn btn-sm btn-outline-secondary">Descargar</a>
          </div>
        `;
        historialContenedor.appendChild(item);
      });
    })
    .catch(err => {
      console.error("Error cargando historial:", err);
      historialContenedor.innerHTML = "<p>Error cargando historial.</p>";
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const fechaEl = document.getElementById("ultima-fecha");
  const vistaEl = document.getElementById("ultima-vista");
  if (!fechaEl || !vistaEl) return;

  // Ojo: como esta página está en /ultima-acta/, toca subir un nivel para ir al historial
  const base = "../historial-actas/actas/";


  fetch(`${base}historial.json`)
    .then(r => r.json())
    .then(data => {
      if (!data.actas || data.actas.length === 0) {
        fechaEl.textContent = "No hay actas disponibles.";
        return;
      }

      // Ordenar y tomar la última
      const ultima = data.actas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];
      const fechaBonita = new Date(ultima.fecha).toLocaleDateString("es-ES", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
      });

      fechaEl.textContent = fechaBonita;
      vistaEl.innerHTML = `
        <iframe src="${base + ultima.nombre}" width="100%" height="650" style="border:1px solid #ccc;"></iframe>
      `;
    })
    .catch(err => {
      console.error("Error cargando última acta:", err);
      fechaEl.textContent = "Error cargando la última acta.";
    });
});

// --- Forzar que los PDF se abran en otra pestaña ---
function targetBlankForPdfReferences() {
  $("a").each(function () {
    var href = $(this).attr('href');
    if (href) {
      href = href.toLowerCase();
      if (href.endsWith(".pdf")) {
        $(this).attr('target', "_blank");
      }
    }
  });
}

$(document).ready(function () {
  // Evitar cierre al hacer click dentro del dropdown
  $(document).on('click', '.dropdown-menu', function (e) {
    e.stopPropagation();
  });

  // Comportamiento tipo acordeón en móviles
  if ($(window).width() < 992) {
    $('.dropdown-menu a').click(function (e) {
      e.preventDefault();
      if ($(this).next('.submenu').length) {
        $(this).next('.submenu').toggle();
      }
      $('.dropdown').on('hide.bs.dropdown', function () {
        $(this).find('.submenu').hide();
      })
    });
  }

  targetBlankForPdfReferences();
  $('a[href^="http://"]').attr('target', '_blank').attr('rel', 'nofollow noopener');
  $('a[href^="https://"]').attr('target', '_blank').attr('rel', 'nofollow noopener');
});

// --- Configuración de datepicker en español ---
$.datepicker.regional['es'] = {
  closeText: 'Cerrar',
  prevText: '< Ant',
  nextText: 'Sig >',
  currentText: 'Hoy',
  monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
  dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
  dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
  dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
  weekHeader: 'Sm',
  dateFormat: 'dd/mm/yy',
  firstDay: 1,
  isRTL: false,
  showMonthAfterYear: false,
  yearSuffix: ''
};
$.datepicker.setDefaults($.datepicker.regional['es']);

const defaultDatepickerOptions = { 
  dateFormat: "yy-mm-dd",
  changeYear: true,
  changeMonth: true
};

$(function () {
  $(".default-date-picker").datepicker(defaultDatepickerOptions);
});
