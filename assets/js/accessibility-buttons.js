var base = $("html");
var fontSizeBase = base.css("font-size");

function aumentar() {
  var currentSize = $("html").css("font-size");
  var currentSize = parseFloat(currentSize) * 1.2;
  $("html").css("font-size", currentSize);
}

function disminuir() {
  var currentSize = $("html").css("font-size");
  var currentSize = parseFloat(currentSize) *  0.8;
  $("html").css("font-size", currentSize);
}

$(document).ready(function() {
  $("#disminuir").click(function () {
    disminuir();
  });
  $("#restablecer").click(function () {
    base.css('font-size', fontSizeBase);
  });
  $("#aumentar").click(function () {
    aumentar();
  });
});

const btnContraste = document.querySelector('.btn_contraste');
const body = document.querySelector('body');

btnContraste.addEventListener('click', () => {
  body.classList.toggle('accesibilidad-contraste');
});

const menuLinks = document.querySelectorAll('#mainNav .dropdown-item');

menuLinks.forEach(item => {
  item.addEventListener('click', (event) => {
    const link = event.target.href;
    window.location = link;
  });
})