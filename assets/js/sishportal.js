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

  const headerFooterMargin = 20; // 2 cm para encabezado y pie
  const contentMargin = 30; // 3 cm para el cuerpo
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const usableWidth = pageWidth - contentMargin * 2;

  const numero = document.getElementById("numeroActa")?.value || "";
  const fecha = document.getElementById("fecha")?.value || "";
  const hora = document.getElementById("hora")?.value || "";
  const lugar = document.getElementById("lugar")?.value || "";
  const descripcion = document.getElementById("descripcion")?.value || "";
  const compromisos = document.getElementById("compromisos")?.value || "";
  const observaciones = document.getElementById("observaciones")?.value || "";

  const asistentes = Array.from(document.querySelectorAll("#asistentes input:checked")).map(chk => chk.value);
  const temas = Array.from(document.querySelectorAll("#temasList li span")).map(span => span.textContent);

  const getBase64Image = url =>
    new Promise((resolve, reject) => {
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
      img.onerror = () => {
        console.error("❌ Error cargando imagen:", url);
        reject(new Error("No se pudo cargar la imagen " + url));
      };
      img.src = url;
    });

  // === Encabezado logo SISH (derecha, altura = 1.96 cm) ===
  const logo = await getBase64Image("https://sish-uis.github.io/generar-acta/assets/img/actas/SISH.jpg");
  const logoHeight = 19.6; // 1.96 cm
  const originalWidth = 93.9;
  const originalHeight = 24.6;
  const logoWidth = (originalWidth / originalHeight) * logoHeight; // mantener proporción
  const logoX = pageWidth - logoWidth - 10; // 10 mm desde borde derecho
  const logoY = (headerFooterMargin - logoHeight) / 2; // centrado vertical en header
  doc.addImage(logo, "JPEG", logoX, logoY, logoWidth, logoHeight);

  // === Contenido ===
  let y = contentMargin;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`Acta No. ${numero}`, pageWidth / 2, y, { align: "center" });
  y += 12;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  const lineHeight = 7;

  const infoData = [
    ["Fecha:", fecha],
    ["Hora:", hora],
    ["Lugar:", lugar],
  ];
  infoData.forEach(([label, value]) => {
    doc.text(label, contentMargin, y);
    doc.setFont("helvetica", "normal");
    doc.text(value || "—", contentMargin + 25, y);
    doc.setFont("helvetica", "bold");
    y += lineHeight;
  });
  y += 5;

  doc.setFont("helvetica", "bold");
  doc.text("Asistentes:", contentMargin, y);
  y += lineHeight;
  doc.setFont("helvetica", "normal");
  if (asistentes.length > 0) {
    asistentes.forEach(a => {
      doc.text(`• ${a}`, contentMargin + 5, y);
      y += lineHeight;
    });
  } else {
    doc.text("Ninguno", contentMargin + 5, y);
    y += lineHeight;
  }
  y += 5;

  doc.setFont("helvetica", "bold");
  doc.text("Temas a Tratar:", contentMargin, y);
  y += lineHeight;
  doc.setFont("helvetica", "normal");
  if (temas.length > 0) {
    temas.forEach(t => {
      doc.text(`• ${t}`, contentMargin + 5, y);
      y += lineHeight;
    });
  } else {
    doc.text("Ninguno", contentMargin + 5, y);
    y += lineHeight;
  }
  y += 5;

  doc.setFont("helvetica", "bold");
  doc.text("Descripción de la reunión:", contentMargin, y);
  y += lineHeight;
  doc.setFont("helvetica", "normal");
  const descripcionText = doc.splitTextToSize(descripcion, usableWidth);
  doc.text(descripcionText, contentMargin, y);
  y += descripcionText.length * 5 + 5;

  doc.setFont("helvetica", "bold");
  doc.text("Compromisos:", contentMargin, y);
  y += lineHeight;
  doc.setFont("helvetica", "normal");
  const compromisosText = doc.splitTextToSize(compromisos, usableWidth);
  doc.text(compromisosText, contentMargin, y);
  y += compromisosText.length * 5 + 5;

  doc.setFont("helvetica", "bold");
  doc.text("Observaciones Generales:", contentMargin, y);
  y += lineHeight;
  doc.setFont("helvetica", "normal");
  const observacionesText = doc.splitTextToSize(observaciones, usableWidth);
  doc.text(observacionesText, contentMargin, y);
  y += observacionesText.length * 5 + 5;

  // === Pie de página logos ===
  const uis = await getBase64Image("https://sish-uis.github.io/generar-acta/assets/img/actas/UIS.JPG");
  const gigba = await getBase64Image("https://sish-uis.github.io/generar-acta/assets/img/actas/GIGBA.PNG");
  const uisWidth = 28.8, uisHeight = 14;
  const gigbaWidth = 15.4, gigbaHeight = 15.6;
  const space = 5;
  const maxLogoHeight = Math.max(uisHeight, gigbaHeight);
  const pieY = pageHeight - headerFooterMargin + (headerFooterMargin - maxLogoHeight) / 2;
  doc.addImage(uis, "JPEG", 10, pieY, uisWidth, uisHeight);
  doc.addImage(gigba, "PNG", 10 + uisWidth + space, pieY, gigbaWidth, gigbaHeight);

  // === Pie de página texto ===
  const footerText = [
    "Universidad Industrial de Santander",
    "Bucaramanga, Colombia",
    "https://sish-uis.github.io/",
    "semillerohidrosistemas@gmail.com",
    "@sish_uis"
  ];
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);

  const textHeight = footerText.length * 3.5;
  const textY = pageHeight - headerFooterMargin + (headerFooterMargin - textHeight) / 2;
  footerText.forEach((line, i) => {
    doc.text(line, pageWidth - 10, textY + i * 3.5, { align: "right" });
  });

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
