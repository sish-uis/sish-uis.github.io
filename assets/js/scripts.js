/* 
 * Agenti 
 * Proporcionado por Natura Software - Todos los derechos reservados 
 * info@naturasoftware.com - www.naturasoftware.com
 */

var frame = null;
var frameHeight = 550;
var frameWidthClass = '';

//Variables a modificar
var saludoBarraMinimizar = "Agente Virtual";
var urlAgVersion = "050724";
//Enlaces de produccion Core
//nombre_local_variables
var nom_local = "AgenteSISH";
var logoSuperiorAv = true;
var iconoAgentiMin = false;
var actAccCO = false;
var actAccSub = false;
var enableNumeroWhatsapp = "573046542725";
navigator.sayswho = (function () {
    var ua = navigator.userAgent,
            tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null)
            return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null)
        M.splice(1, 1, tem[1]);
    return M.join(' ');
})();
if (typeof (jQuery) === 'undefined') {
    /*    var script = document.createElement('script');
     script.src = urlAg + 'js/jquery.min.js';
     document.getElementsByTagName('head')[0].appendChild(script);
     */
    //    document.write("<scr" + 'ipt type="text/javascript" src="' + urlAg + 'js/lib/$.1.11.min.js"></scr' + "ipt>");
    console.log("jQuery: undefined");
    (function () {
        var script = document.createElement("SCRIPT");
        script.src = urlAg + 'js/jquery-3.6.4.min.js';
        script.type = 'text/javascript';
        script.onload = function () {
            //jQuery(document).ready(function() { 
            var $ = window.jQuery;
            chargeAgenti($);
            //});   
        };
        document.getElementsByTagName("head")[0].appendChild(script);
    })();
} else {
    console.log("jQuery: function");
    //(function() {    
    //jQuery(document).ready(function() { 
    var $ = window.jQuery;
    chargeAgenti($);
    //});                         
    //})();	
}

window.onresize = resize;

function resize()
{
    //alert("externo del iframe resize event detected!");
    console.log("externo del iframe resize event detected!");
    navigatorUserAgentResize();

}

function navigatorUserAgent() {
    var device = navigator.userAgent;
    if (device.match(/Iphone/i) || device.match(/Ipod/i) || device.match(/Android/i) || device.match(/J2ME/i) || device.match(/BlackBerry/i) || device.match(/iPhone|iPad|iPod/i) || device.match(/Opera Mini/i) || device.match(/IEMobile/i) || device.match(/Mobile/i) || device.match(/Windows Phone/i) || device.match(/windows mobile/i) || device.match(/windows ce/i) || device.match(/webOS/i) || device.match(/palm/i) || device.match(/bada/i) || device.match(/series60/i) || device.match(/nokia/i) || device.match(/symbian/i) || device.match(/HTC/i) || device.match(/CriOS/i)) {
        //window.location = "http://www.google.com/";
        console.log("Movil detected!");
        var height = $(window).height();
        height = height - 52;
        frameHeight = height;
        //panelPrincipalAgenti
        //.agenti.ns.panel
        frameWidthClass = 'agentiPanelMovil';
        $("#panelPrincipalAgenti").addClass('agentiPanelMovil');
    } else {
        //console.log("Escritorio detected!");
        frameHeight = 550;
        $("#panelPrincipalAgenti").removeClass('agentiPanelMovil');
    }
}

function navigatorUserAgentResize() {
    var device = navigator.userAgent;
    if (device.match(/Iphone/i) || device.match(/Ipod/i) || device.match(/Android/i) || device.match(/J2ME/i) || device.match(/BlackBerry/i) || device.match(/iPhone|iPad|iPod/i) || device.match(/Opera Mini/i) || device.match(/IEMobile/i) || device.match(/Mobile/i) || device.match(/Windows Phone/i) || device.match(/windows mobile/i) || device.match(/windows ce/i) || device.match(/webOS/i) || device.match(/palm/i) || device.match(/bada/i) || device.match(/series60/i) || device.match(/nokia/i) || device.match(/symbian/i) || device.match(/HTC/i) || device.match(/CriOS/i)) {
        //window.location = "http://www.google.com/";
        console.log("Movil detected!");
        var height = $(window).height();
        height = height - 52;
        //$("#ag-frame").css('height', height + 'px');  
        document.getElementById("ag-frame").style.height = height + 'px';
        $("#panelPrincipalAgenti").addClass('agentiPanelMovil');
    } else {
        //console.log("Escritorio detected!");   
        frameHeight = 550;
        $("#panelPrincipalAgenti").removeClass('agentiPanelMovil');
    }
}

function chargeAgenti($) {
    /*var script = document.createElement('script');
     script.src = urlAg + 'js/PgwCookie/pgwcookie.min.js';
     document.getElementsByTagName('head')[0].appendChild(script);*/

    //$('<div class="agenti-ui"></div>').insertAfter($("body"));    
    //$.getScript(urlAg + "js/PgwCookie/pgwcookie.min.js", function(data, textStatus, jqxhr) {
    //    console.log(textStatus);        

    //});    	

    function getAgenti(urlAg) {
        navigatorUserAgent();
        var inserlogoSuperior = "";
        var inserIconoAgentiMin = "";
        var inserIconoWhatsapp = "";
        if (logoSuperiorAv) {
            inserlogoSuperior = '<div class="avatar agenti"></div>';
        }
        if (iconoAgentiMin) {
            inserIconoAgentiMin = '<div id="panelPrincipalAgentiICO" style="visibility: hidden;" class="agentimuneca"><a href="javascript:void(0)" class="icon_minim panel-collapsed" onclick="jQuery(\'.agenti-controls .icon_minim\').click(); return false;"><img alt="" class="iconoAgentiMin" style="display:none;"  src="' + urlAg + 'img/iconoAgentiMin.png" ></a></div>';
        }
        if (enableNumeroWhatsapp !== "") {
            inserIconoWhatsapp = '<a href="https://api.whatsapp.com/send?phone=' + enableNumeroWhatsapp + '&text=Hola" target="_blank" title="WhatsApp" class="imagenWhatsappAg"></a>';
        }
        agUrl = urlAg + 'views/login.html' + '?' + urlAgVersion;
        var ag = inserIconoAgentiMin +
                '<div id="panelPrincipalAgenti" style="width: 0px;" class="panel panel-default agenti ns minimized ' + frameWidthClass + '">' +
                '<div class="panel-heading top-bar-ag" >' +
                '<div class="activeZone"></div>' +
                '<div id="barraTopAgenti"><div class="logo minimized"></div>' +
                '<div class="panel-title"><div class="title-minimized"><b>' + saludoBarraMinimizar + '</b></div><!--span class="spc"><i class="fa fa-spinner fa-pulse"></i></span--></div>' +
                '<div class="agenti-controls">' +
                '<div class="icon_minim panel-collapsed" onclick="return false;"><i id="minim_chat_window"></i></div>' +
                '</div>' +
                '</div>' +
                '<div id="iframePrincipalAgenti" class="panel-body ">' +
                /*'<iframe name="ag-frame" id="ag-frame" src="' + agUrl + '" allow="autoplay; geolocation; microphone; camera" width="100%" height="' + frameHeight + '" style="border-top: none;border-right: none;border-left: none;border-bottom: none;" scrolling="no" onload="loadFrame()">' +
                 '</iframe>' +*/
                '</div>' +
                '<div id="panel-footer" class="panel-footer panel-footer-display minimized">' +
                '<span class="icon-info-ns">Powered by <a href="https://www.agenti.com.co/" target="_blank">Agenti<svg width="12" height="12" viewBox="0 0 30 35" class="fa-leaf-ag"><path d="M22.666 14.194q0-0.45-0.329-0.778t-0.778-0.329q-2.975 0-5.501 0.856t-4.489 2.318-4.074 3.797q-0.329 0.363-0.329 0.778 0 0.45 0.329 0.778t0.778 0.329q0.415 0 0.778-0.329 0.467-0.415 1.28-1.228t1.159-1.142q2.37-2.145 4.644-3.044t5.423-0.899q0.45 0 0.778-0.329t0.329-0.778zM31.522 10.769q0 1.643-0.346 3.338-0.796 3.875-3.191 6.625t-6.184 4.636q-3.702 1.868-7.576 1.868-2.56 0-4.947-0.813-0.259-0.087-1.522-0.727t-1.661-0.64q-0.277 0-0.683 0.553t-0.778 1.211-0.908 1.211-1.038 0.553q-0.519 0-0.882-0.19t-0.536-0.415-0.467-0.727q-0.035-0.069-0.104-0.19t-0.095-0.173-0.052-0.164-0.026-0.233q0-0.605 0.536-1.271t1.176-1.133 1.176-0.969 0.536-0.83q0-0.069-0.242-0.657t-0.277-0.761q-0.156-0.882-0.156-1.799 0-1.989 0.752-3.805t2.058-3.191 2.949-2.404 3.529-1.652q0.951-0.311 2.508-0.441t3.105-0.156 3.088-0.104 2.828-0.415 1.963-0.977l0.51-0.51q0 0 0.51-0.484t0.467-0.346 0.631-0.277 0.752-0.078q0.675 0 1.219 0.796t0.822 1.937 0.415 2.145 0.138 1.661z"></path></svg></a></span>' +
                '</div>' +
                '</div>' +
                inserlogoSuperior +
                '</div>' +
                inserIconoWhatsapp;
        $('head').append('<link rel="stylesheet" href="' + urlAg + 'css/agenti.styleColors.css?' + urlAgVersion + '" type="text/css" />');
        $('head').append('<link rel="stylesheet" href="' + urlAg + 'css/agenti.style.css?' + urlAgVersion + '" type="text/css" />');
        $(ag).appendTo($("body"));
        if (false) {
            $("#panelPrincipalAgenti").toggleClass("claseColorAgGris");
        }
        if (logoSuperiorAv) {
            $('.imgCabeceraCen').hide();
        }

        //Valida si muestra banner inferior o el de la pagina del proveedor para maximizar el chat 
        if (document.getElementsByClassName('agentiGen').length > 0) {
            setTimeout(function () {
                $('.agentiGen').on('click', maximizarChat);
                if (iconoAgentiMin) {
                    $("#panelPrincipalAgentiICO").css("visibility", "visible");
                } else {
                    //document.getElementById('panelPrincipalAgenti').style.visibility = "visible";
                }
            }, 3000);
        } else {
            setTimeout(function () {
                isConversacionTomadaAsesor();
                if (document.getElementsByClassName('agentiGen').length > 0) {
                    $('.agentiGen').on('click', maximizarChat);
                    if (iconoAgentiMin) {
                        $("#panelPrincipalAgentiICO").css("visibility", "visible");
                    } else {
                        //document.getElementById('panelPrincipalAgenti').style.visibility = "visible";  
                    }
                } else {
                    if (iconoAgentiMin) {
                        $("#panelPrincipalAgentiICO").css("visibility", "visible");
                    } else {
                        document.getElementById('panelPrincipalAgenti').style.visibility = "visible";
                    }
                }
            }, 3000);
        }
        //Habilitar eventos de accesibilidad
        setTimeout(function () {
         //$('#high_contrast_off').on('click', escalaGris);
         //$('.b-acc-grayscale').on('click', escalaGris);
         $('.btn_restablecer').click(function() {escalaTamano(0)});
         $('.btn_disminuir').click(function() {escalaTamano(1)});
         $('.btn_aumentar').click(function() {escalaTamano(2)});
         $('.btn_contraste').on('click', ContrasteOscuro);
         //$('.b-acc-toggle-underline').on('click', textoSubrayar);
         }, 3000);
        setAgentiActions();
        validarAccessibilityContrast();
        //document.getElementById('ag-frame').contentDocument.location.reload(true);
        //document.getElementById('ag-frame').src = agUrl;
    }
    if (!document.getElementById('panelPrincipalAgenti')) {
        getAgenti(urlAg);
    }
    function isConversacionTomadaAsesor() {
        if (document.getElementById('ag-frame') == null) {
            if (obtenerJsession() !== null) {
                var jsession = obtenerJsession();
                var data = {
                    hsm: 0,
                    jsessionid: jsession
                };
                var response = $.ajax({
                    'url': servidorAgentiUrl + 'get;jsessionid=' + data.jsessionid,
                    'data': data,
                    'type': 'POST',
                    'async': false
                });
                console.log("conversacionActiva -> " + response.responseText);
                var cvnew = (response.responseText === 'true' ? true : false);
                if (cvnew) {
                    $('#iframePrincipalAgenti').append('<iframe name="ag-frame" id="ag-frame" src="' + agUrl + '" allow="autoplay; geolocation; microphone; camera" width="100%" height="' + frameHeight + '" style="border-top: none;border-right: none;border-left: none;border-bottom: none;" scrolling="no" onload="loadFrame()"></iframe>');
                    $('.agenti.minimized .activeZone').click();
                }
            }
        }
    }
    function almacenarJsession(jsession) {
        try {
            window.localStorage.setItem('jsession' + nom_local, jsession);
            return true;
        } catch (err) {
            console.log(err.message);
            return null;
        }
    }
    function obtenerJsession() {
        try {
            return window.localStorage.getItem('jsession' + nom_local);
        } catch (err) {
            console.log(err.message);
            return null;
        }
    }
    function eliminarJsession() {
        try {
            window.localStorage.removeItem('jsession' + nom_local);
            window.sessionStorage.clear();
            return true;
        } catch (err) {
            console.log(err.message);
            return null;
        }
    }
    //continues();
    function validarAccessibilityContrast() {
        var acce = window.localStorage.getItem('accessibility_contrast_grises_ag');
        if (acce !== null) {
            if (acce === "true") {
                escalaGris();
            }
        }
        var acceOsc = window.localStorage.getItem('accessibility_contrast_oscuro_ag');
        if (acceOsc !== null) {
            if (acceOsc === "true") {
                setTimeout("ContrasteOscuro();", 1000);
            }
        }
    }
    function chkAG() {
        //    var ins = localStorage.getItem("instance");
        ins = $.parseJSON(localStorageAg);
        var data = localStorage.getItem('userSession');
        if (typeof ($.pgwCookie) !== 'undefined') {
            k = JSON.parse(data);
            if (typeof k !== 'undefined' && k !== null) {
                //			console.log(k);
                ins = {
                    "instance": k.botID
                };
            }
        }
    }

    /*jQuery(document).ready(function() {            
     getAgenti(urlAg);
     frame = document.getElementById('ag-frame').contentWindow;        
     continues();
     });*/

    window.addEventListener('message', function (event) {
        /*if (newNav) {
         //console.log(event.data);
         }*/
        if (event.data !== undefined) {
            if (event.data.indexOf !== undefined) {
                if (event.data.indexOf('{') > -1) {
                    var payload = JSON.parse(event.data);
                    //            console.log(payload);
                    switch (payload.method) {
                        case 'minimizar':
                            $('#minim_chat_window').click();
                            break;
                        case 'ocultarPanelfooter':
                            //$("#panel-footer").removeClass('maximized').addClass('minimized'); 
                            break;
                        case 'chk':
                            /*if ((payload.data) === true) {
                             chk = setInterval(function () {
                             chkAG()
                             }, 10000);
                             } else {
                             clearInterval(chk);
                             var frame = document.getElementById('ag-frame');
                             frame.contentWindow.postMessage(JSON.stringify({
                             key: 'close',
                             data: true
                             }), "*");
                             }*/
                            break;
                        case 'wait':
                            wait();
                            break;
                        case 'continues':
                            continues();
                            break;
                        case 'maximize':
                            if($('.agenti.ns.maximized').length === 0){
                                $('.agenti.minimized .activeZone').click();
                            }
                            break;
                        case 'avatarShow':
                            $(".agenti.ns.panel").css("width", 590);
                            break;
                        case 'avatarHide':
                            $(".agenti.ns.panel").css("width", 270);
                            break;
                        case 'alert':
                            alert(payload.message);
                            break;
                        case 'irAlmacenarJsession':
                            almacenarJsession(payload.jsession);
                            break;
                        case 'irEliminarJsession':
                            eliminarJsession();
                            break;
                        case 'contrasteOscuro':
                            if (actAccCO) {
                                var frame = document.getElementById('ag-frame');
                                frame.contentWindow.postMessage(JSON.stringify({
                                    key: 'ContrasteOscuro',
                                    data: true
                                }), "*");
                            }
                            break;
                    }
                }
            }
        }
    });


    function wait() {
        $('.spc').show();
    }

    function continues() {
        setTimeout(function () {
            $("#panelPrincipalAgenti").css("display", "initial");
        }, 300);
        setTimeout(function () {
            $('.spc').hide();
        }, 700);
    }


    function setAgentiActions() {
        instance = me = $('.agenti.ns');
        $('.agenti .panel-title, .agenti .agbk_left, .agenti .logo, .agenti .activeZone, .agenti .avatar').click(function () {
            $('.agenti-controls .icon_minim').click();
        });
        me.on('click', '.agenti-controls .icon_minim', function (e) {
            var $this = $(this);
            //        console.log($this);
            if (!$this.hasClass('panel-collapsed')) {
                $this.parents('.panel').removeClass('maximized').addClass('minimized').find('.panel-body');
                $this.addClass('panel-collapsed');
                $("#panel-footer").removeClass('maximized').addClass('minimized');
                $(".agenti .logo").addClass('minimized');
                /*$(".title-maximized").css("visibility", "hidden");
                 $(".title-minimized").css("visibility", "visible");*/
                $("#barraTopAgenti").removeClass('barraTopAgenti');
            } else {
                if (document.getElementById('ag-frame') == null) {
                    $('#iframePrincipalAgenti').append('<iframe name="ag-frame" id="ag-frame" src="' + agUrl + '" allow="autoplay; geolocation; microphone; camera" width="100%" height="' + frameHeight + '" style="border-top: none;border-right: none;border-left: none;border-bottom: none;" scrolling="no" onload="loadFrame()"></iframe>');
                }
                //$('.panel-footer-display').css("display", "block");
                $this.parents('.panel').removeClass('minimized').addClass('maximized').find('.panel-body');
                $this.removeClass('panel-collapsed');
                $("#panel-footer").removeClass('minimized').addClass('maximized');
                $(".agenti .logo").removeClass('minimized');
                /*$(".title-maximized").css("visibility", "visible");
                 $(".title-minimized").css("visibility", "hidden");*/
                $("#barraTopAgenti").addClass('barraTopAgenti');
                setAgentiMinimize(me);
            }
        });

        $(document).on('click', '.icon_close', function (e) {

            if (typeof userSession !== 'undefined') {

                ins = userSession.botID;
                if (ins !== null) {
                    exitChatQ(true);
                }
            } else {
                $('.agenti-controls .icon_minim').click();
            }
        });
    }
    /**/
    function exitChatQ(q) {
        frame = document.getElementById('ag-frame');

    }
    /**/
    function setAgentiMinimize(me) {
        if (me.hasClass('maximized')) {
            $('.panel-heading span.icon_minim').click();
        }
    }

    function setAgentiMaximize(me) {
        if (me.hasClass('maximized')) {
            winMaximize();
        }
    }

    function winResize() {
        /*        console.log("resize");
         var sizew2 = 320;
         var sizeh2 = 530;
         if (checkNavigator()) {
         if (window.innerWidth > window.innerHeight) {
         sizew2 = $(window).width() - 100;
         sizeh2 = $(window).height() - 50;
         sizeh3 = sizeh2 - 140;
         } else {
         sizew2 = $(window).width();
         sizeh2 = $(window).height() - 50;
         }
         } else {
         sizew = 320;
         sizeh = 530;
         }
         //setSize(sizew2, sizeh2);
         minimize();
         */
    }

    function winMaximize() {
        //    console.log("winMaximize");
        //    console.log(checkNavigator());

        //setSize(sizew2, sizeh2);
    }

    function agentiCompress() {
        console.log("agentiCompress");

        //setSize(sizew2, sizeh2);
    }

    function agentiExpand() {
        console.log("agentiExpand");

        //setSize(sizew2, sizeh2);
    }

    function checkNavigator() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return true;
        } else {
            return false;
        }
    }
    if (checkNavigator()) {
        $(window).bind('orientationchange', function (e) {
            winResize();
        });
    } else {
        $(window).resize(function () {
            winResize();
        });
    }

    function setSize(w, h) {
        /*  me.animate({
         height: h,
         width: w
         }, 100); */
        $enc = 0;
        $enc2 = $enc;
        //    $('.agenti .msg_container_base').css("height", (h - $enc));
        $('#ag-frame').attr("height", (h - $enc2));
    }

    function minimize() {
        setAgentiMinimize(instance);
    }

}
function loadFrame() {
    frame = document.getElementById('ag-frame');
    //console.log(uS);
    /*if (typeof uS !== 'undefined' && (uS !== null)) {
     inst = userSession.botID
     }*/
}
function escalaGris() {
    $("#panelPrincipalAgenti").toggleClass("claseColorAgGris");
    if ($(".claseColorAgGris").length === 1) {
        window.localStorage.setItem('accessibility_contrast_grises_ag', true);
        //Cookies.set('ag_sish_accesBlack_site_header', 'yes');
    } else {
        window.localStorage.removeItem('accessibility_contrast_grises_ag');
        //Cookies.set('ag_sish_accesBlack_site_header', 'no');
    }
}
function escalaTamano(ta) {
    var frame = document.getElementById('ag-frame');
    if (frame) {
        frame.contentWindow.postMessage(JSON.stringify({
            key: 'escalaTamano',
            data: ta
        }), "*");
    }
}

function ContrasteOscuro() {
    if (!actAccCO) {
        actAccCO = true;
        $(".top-bar-ag").css("background", "#000");
        window.localStorage.setItem('accessibility_contrast_oscuro_ag', true);
    } else {
        actAccCO = false;
        $(".top-bar-ag").css("background", "");
        window.localStorage.removeItem('accessibility_contrast_oscuro_ag');
    }
    var frame = document.getElementById('ag-frame');
    if (frame) {
        frame.contentWindow.postMessage(JSON.stringify({
            key: 'ContrasteOscuro',
            data: actAccCO
        }), "*");
    }
}

function textoSubrayar() {
    if (!actAccSub) {
        actAccSub = true;
    } else {
        actAccSub = false;
    }
    var frame = document.getElementById('ag-frame');
    if (frame) {
        frame.contentWindow.postMessage(JSON.stringify({
            key: 'textoSubrayar',
            data: actAccSub
        }), "*");
    }
}
function maximizarChat() {
    //$('.agenti-controls .icon_minim').click();
    $('.panel-title').click();
}