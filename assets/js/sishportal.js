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
          <label for="numeroActa">Número de Acta</label>
          <input type="text" class="form-control" id="numeroActa" readonly>
        </div>
        <div class="form-group col-md-3">
          <label for="fecha">Fecha</label>
          <input type="date" class="form-control" id="fecha">
        </div>
        <div class="form-group col-md-3">
          <label for="hora">Hora</label>
          <input type="time" class="form-control" id="hora">
        </div>
        <div class="form-group col-md-3">
          <label for="lugar">Lugar</label>
          <input type="text" class="form-control" id="lugar" placeholder="Ej: Sala de reuniones JBV">
        </div>
      </div>

      <!-- Asistentes -->
      <div class="form-group">
        <label>Asistentes</label>
        <div id="asistentes" class="d-flex flex-column" style="gap:5px;"></div>
      </div>

      <!-- Temas a tratar -->
      <div class="form-group">
        <label>Temas a tratar</label>
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
        <label for="descripcion">Descripción de la reunión</label>
        <textarea class="form-control" id="descripcion" rows="5"></textarea>
      </div>
      <div class="form-group">
        <label for="compromisos">Compromisos</label>
        <textarea class="form-control" id="compromisos" rows="3"></textarea>
      </div>
      <div class="form-group">
        <label for="observaciones">Observaciones Generales</label>
        <textarea class="form-control" id="observaciones" rows="3"></textarea>
      </div>

      <!-- Anexos -->
      <div class="form-group">
        <label for="anexos">Anexos (imágenes)</label>
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
        div.className = "form-check";
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
            <img src="${e.target.result}" class="img-thumbnail" style="width:100%;height:auto;object-fit:cover;">
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

// ===== Función Generar PDF =====
function generarPDF() {
  if (!window.jspdf) { 
    alert("jsPDF no está cargado"); 
    return; 
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ format: "letter", unit: "cm" });
  const margen = { top: 3.5, bottom: 2.5, left: 3, right: 3 };
  let y = margen.top;

  const contenedor = document.getElementById("formulario-acta");
  if (!contenedor) return;

  // --- Función auxiliar para cargar imagen y devolver Promise ---
  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = () => reject(`No se pudo cargar la imagen: ${src}`);
    });
  }

  // --- Función para escribir título y valor ---
  function escribir(titulo, valor, x, yPos) {
    doc.setFont("Arial", "bold");
    doc.text(titulo, x, yPos);
    doc.setFont("Arial", "normal");
    doc.text(valor, x + 1.5, yPos);
  }

  // --- Generar PDF paso a paso ---
  (async () => {
    try {
      // --- Encabezado ---
      const encabezadoImg = await loadImage("/ruta/encabezado.png");
      doc.addImage(encabezadoImg, "PNG", 21.59 - margen.right - 9.39, 0.5, 9.39, 2.46);
      y += 3;

      const numero = contenedor.querySelector("#numeroActa")?.value || "Acta";
      const fecha = contenedor.querySelector("#fecha")?.value || "";
      const hora = contenedor.querySelector("#hora")?.value || "";
      const lugar = contenedor.querySelector("#lugar")?.value || "";

      escribir("Número de Acta:", numero, margen.left, y);
      escribir("Fecha:", fecha, margen.left + 10, y);
      escribir("Hora:", hora, margen.left + 14, y);
      escribir("Lugar:", lugar, margen.left + 17, y);
      y += 1;

      // --- Asistentes ---
      doc.setFont("Arial", "bold");
      doc.text("Asistentes:", margen.left, y);
      y += 0.5;
      doc.setFont("Arial", "normal");
      contenedor.querySelectorAll("#asistentes input:checked").forEach(chk => {
        doc.text(`- ${chk.value}`, margen.left, y);
        y += 0.5;
      });
      y += 0.5;

      // --- Temas ---
      doc.setFont("Arial", "bold");
      doc.text("Temas a tratar:", margen.left, y);
      y += 0.5;
      doc.setFont("Arial", "normal");
      contenedor.querySelectorAll("#temasList li span").forEach(tema => {
        doc.text(tema.textContent, margen.left, y);
        y += 0.5;
      });
      y += 0.5;

      // --- Descripción, Compromisos, Observaciones ---
      ["#descripcion", "#compromisos", "#observaciones"].forEach(selector => {
        const valor = contenedor.querySelector(selector)?.value || "";
        doc.setFont("Arial", "bold");
        doc.text(selector.replace("#","").charAt(0).toUpperCase() + selector.slice(2), margen.left, y);
        y += 0.5;
        doc.setFont("Arial", "normal");
        const lines = doc.splitTextToSize(valor, 21.59 - margen.left - margen.right);
        doc.text(lines, margen.left, y);
        y += lines.length * 0.5 + 0.2;
      });

      // --- Anexos ---
      for (const imgEl of contenedor.querySelectorAll("#preview img")) {
        const img = await loadImage(imgEl.src);
        const anchoParrafo = 21.59 - margen.left - margen.right;
        const imgAncho = anchoParrafo * 0.75;
        const imgAlto = imgAncho * (img.naturalHeight / img.naturalWidth);
        if (y + imgAlto > 27.94 - margen.bottom) { 
          doc.addPage(); 
          y = margen.top; 
        }
        doc.addImage(img, "PNG", margen.left, y, imgAncho, imgAlto);
        y += imgAlto + 0.5;
      }

      // --- Pie ---
      const pie1 = await loadImage("/ruta/pie1.png");
      const pie2 = await loadImage("/ruta/pie2.png");
      doc.addImage(pie1, "PNG", margen.left, 27.94 - margen.bottom - 1.4, 2.88, 1.4);
      doc.addImage(pie2, "PNG", margen.left + 2.88 + 0.2, 27.94 - margen.bottom - 1.56, 1.54, 1.56);

      doc.setFont("Arial", "normal");
      doc.setFontSize(8);
      const textoDerecha = `Universidad Industrial de Santander
Bucaramanga, Colombia
https://sish-uis.github.io/
semillerohidrosistemas@gmail.com
@sish_uis`;
      const lines = doc.splitTextToSize(textoDerecha, 21.59 - margen.left - margen.right);
      doc.text(lines, 21.59 - margen.right - 7, 27.94 - margen.bottom - 1.5, { align: "right" });

      // --- Guardar PDF ---
      doc.save(`Acta_${numero}.pdf`);
    } catch (error) {
      console.error("Error generando PDF:", error);
      alert("Ocurrió un error generando el PDF. Revisa la consola.");
    }
  })();
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
