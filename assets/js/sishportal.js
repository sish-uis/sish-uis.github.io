document.addEventListener("DOMContentLoaded", () => {
    fetch('/common/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        })
        .catch(err => console.error('Error cargando header:', err));

    fetch('/common/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(err => console.error('Error cargando footer:', err));
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
