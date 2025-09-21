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

  // --- Función para cargar equipo ---
function cargarEquipo(ruta, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  if (contenedor) {
    fetch(ruta)
      .then(response => response.json())
      .then(data => {
        data.forEach(persona => {
          const card = document.createElement("div");
          card.className = "col-12 mb-4";

          // Convertimos saltos de línea en HTML <br>, doble salto para renglones extra
          const descripcionHTML = persona.descripcion
                                      .replace(/\n\n/g, '<br><br>')
                                      .replace(/\n/g, '<br>');

          card.innerHTML = `
            <div class="card shadow-sm h-100">
              <div class="row g-0">
                <!-- Columna foto + contacto -->
                <div class="col-md-5 d-flex flex-column align-items-center p-3">
                  <img src="${persona.foto}" class="img-fluid rounded mb-2" alt="${persona.nombre}" style="width: 180px; height: auto;">
                  <h6 class="card-title mb-3">Datos de contacto</h6> <!-- aumenté mb-1 a mb-3 -->

                  <!-- Íconos CvLAC y LinkedIn separados con gap -->
                  <div class="d-flex justify-content-center mb-4" style="gap: 20px;"> <!-- aumenté mb-2 a mb-4 -->
                    ${persona.links?.cvlac ? `<a href="${persona.links.cvlac}" target="_blank" title="CvLAC" class="text-primary">
                      <em class="fas fa-file-alt" style="font-size: 1.5rem;"></em></a>` : ""}
                    ${persona.links?.linkedin ? `<a href="${persona.links.linkedin}" target="_blank" title="LinkedIn" class="text-primary">
                      <em class="fab fa-linkedin" style="font-size: 1.5rem;"></em></a>` : ""}
                  </div>

                  <!-- Correo debajo con espacio suficiente -->
                  ${persona.links?.email ? `<div class="d-flex align-items-center">
                      <em class="fas fa-envelope text-primary" style="font-size: 1.5rem; cursor: pointer; margin-right: 10px;" title="Copiar correo electrónico" onclick="navigator.clipboard.writeText('${persona.links.email}')"></em>
                      <span>${persona.links.email}</span>
                    </div>` : ""}
                </div>

                <!-- Columna info -->
                <div class="col-md-7">
                  <div class="card-body">
                    <h5 class="card-title mb-3">${persona.nombre}</h5> <!-- más margen -->
                    <h6 class="card-subtitle mb-3 text-muted">${persona.cargo}</h6> <!-- más margen -->
                    <p class="card-text" style="text-align: justify; margin-top: 0;">${descripcionHTML}</p>
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
}











  // --- Cargar docentes y estudiantes ---
  cargarEquipo("/nuestra-gente/docentes.json", "docentes");
  cargarEquipo("/nuestra-gente/estudiantes.json", "estudiantes");
});




function targetBlankForPdfReferences() {
    $("a").each(function (index) {
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
    // jQuery code

    //////////////////////// Prevent closing from click inside dropdown
    $(document).on('click', '.dropdown-menu', function (e) {
        e.stopPropagation();
    });

    // make it as accordion for smaller screens
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

});

$(document).ready(function () {
    targetBlankForPdfReferences();
    $('a[href^="http://"]').attr('target', '_blank');
    $('a[href^="http://"]').attr('rel', 'nofollow noopener');
    $('a[href^="https://"]').attr('target', '_blank');
    $('a[href^="https://"]').attr('rel', 'nofollow noopener');
    //accessibilityButtons();
});

// Pone como valor por defecto "es" para el idioma de los calendarios
$.datepicker.regional['es'] = {
    closeText: 'Cerrar',
    prevText: '< Ant',
    nextText: 'Sig >',
    currentText: 'Hoy',
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
    dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
    weekHeader: 'Sm',
    dateFormat: 'dd/mm/yy',
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ''
};
$.datepicker.setDefaults($.datepicker.regional['es']);

defaultDatepickerOptions = { 
    dateFormat: "yy-mm-dd",
    changeYear: true,
    changeMonth: true
};

$(function () {
    $(".default-date-picker").datepicker(defaultDatepickerOptions);
});
