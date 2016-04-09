/*//Rescargar la página para que pueda leer los get
if (localStorage.getItem('carga') != document.URL) {
    localStorage.setItem('carga',document.URL);
    location.reload();
}*/

    
$(document).ready(function(){
    
//Recargar Javascript cada cierto tiempo para poder leer los datos de get y validar formularios aun que haya pasado de la primera página cargada
setInterval(refres, 1000);
    //$('form').submit(function(){alert('submit');});
    //RECOJER PARAMETROS GET
    function _GET(param) {
        $('a[data-rel=dialog]').click(function() {
            //alert('reload');
            if (localStorage.getItem('carga') != $(this).attr('href')) {
                alert('Por favor, vuelva a pulsar');
                localStorage.setItem('carga', $(this).attr('href'));
                location.reload();
            }
        });
        /* Obtener la url completa */
        url = document.URL;
        /* Buscar a partir del signo de interrogación ? */
        url = String(url.match(/\?+.+/));
        /* limpiar la cadena quitándole el signo ? */
        url = url.replace("?", "");
        /* Crear un array con parametro=valor */
        url = url.split("&");

        /*
        Recorrer el array url
        obtener el valor y dividirlo en dos partes a través del signo =
        0 = parametro
        1 = valor
        Si el parámetro existe devolver su valor
        */
        x = 0;
        //alert(url);
        while (x < url.length)
        {
            p = url[x].split("=");
            
            if (p[0] == param)
            {
                return decodeURIComponent(p[1]);
            }
            x++;
        }
    }
    function refres() {
        var alumno = _GET("nom");
        if (alumno!=null) {
            $('input#nom').val(alumno);
            $('.spanAlumno').html(alumno.replace(/[_|#]/g, ' '));
        }
         //alert(alumno);

        //INCLUIR NOTAS
        var contenido = _GET("contenido");
        if (contenido!=null && alumno!=null) {
            localStorage.setItem('contenido'+alumno, contenido);
        }
        var calidad = _GET("calidad");
        if (calidad!=null && alumno!=null) {
            localStorage.setItem('calidad'+alumno, calidad);
        }
        var oral = _GET("oral");
        if (oral!=null && alumno!=null) {
            localStorage.setItem('oral'+alumno, oral);
        }

        //PONER NOTAS EN LA TABLA
        if ($('#tablaCalificaciones').length > 0) {
            var arrayAlumnos=['Perico_Palotes','Maria_Maza','Ana_Pina','Pedro_Guerra'];
            for (i in arrayAlumnos) {
            //alert('contenido'+arrayAlumnos[i]);
            //alert(localStorage.getItem('contenido'+arrayAlumnos[i])!=null);
               if (localStorage.getItem('contenido'+arrayAlumnos[i])!=null) {
                   $('#contenido'+arrayAlumnos[i]).html(localStorage.getItem('contenido'+arrayAlumnos[i]));
                }
               if (localStorage.getItem('calidad'+arrayAlumnos[i])!=null) {
                   $('#calidad'+arrayAlumnos[i]).html(localStorage.getItem('calidad'+arrayAlumnos[i]));
                }
               if (localStorage.getItem('oral'+arrayAlumnos[i])!=null) {
                   $('#oral'+arrayAlumnos[i]).html(localStorage.getItem('oral'+arrayAlumnos[i]));
                }
            }
        }
    
        if ($("#formulario").length > 0) {
            //VALIDAR FORMULARIOS
            $.validator.addMethod("passValido", passValido, "El Password no es correcto.");
            $.validator.addMethod("nomValido", nomValido, "El Password no es correcto.");
            function passValido(pass) {
                valido = false;
                pass = CryptoJS.MD5(pass).toString();
                for (i in usuarios) {
                    if (usuarios[i].password == pass) {
                        valido = true;
                        break;
                    }
                }
                return valido;
            }
            function nomValido(nom) {
                valido = false;
                for (i in usuarios) {
                    if (usuarios[i].name == nom) {
                        valido = true;
                        break;
                    }
                }
                return valido;
            }
            $("#formulario").validate({ 
                rules: {
                    'name':{
                        required: true, 
                        minlength: 2,
                        nomValido:true
                    },
                    'password':{
                        required: true,
                        minlength: 6,
                        maxlength: 10,
                        passValido:true
                    },
                },
                debug: true, 
                submitHandler: function(form) {
                    form.submit();
                }
            });
        } else if ($("#calificar").length > 0) {
            $("#calificar").validate({ 
                rules: {
                    'contenido':{
                        required: true, 
                        max: 6.5
                    },
                    'calidad':{
                        required: true,
                        max: 1
                    },
                    'oral':{
                        required: true,
                        max: 2.5
                    },
                },
                debug: true, 
                submitHandler: function(form) {
                    form.submit();
                }
            });
        }
    }
});