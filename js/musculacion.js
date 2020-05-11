$(document).ready(function() {
  var authSufix = "";
  var loginUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo";
  var response = $.post(loginUrl, {
            "email": "ignalau@iltempo.com",
            "password": "contraseña123",
            "returnSecureToken": true,
          },function(data, status, jqXHR) {
            authSufix = "auth=" + data["idToken"];
            // Musculación
            $.getJSON('https://il-tempo-dda8e.firebaseio.com/trainings/Musculacion.json?'+ authSufix, function(data) {
              $('#musculacion_teacher').val(data["profesor"]);
              $('#musculacion_description').val(data["descripcion"]);
              $('#musculacion_max').val(data["maxSchedules"]);
              $('#musculacion_duration').val(data["duration"]);
              var horarios_lunes = "";
              var horarios_martes = "";
              var horarios_miercoles = "";
              var horarios_jueves = "";
              var horarios_viernes = "";
              for(var horario of data["horario"]) {
                var arr = horario.split(".");
                if(arr[3].length == 1) arr[3] += "0";
                switch (arr[1]) {
                  case "27":
                    horarios_lunes += (arr[2] + ":" + arr[3] + ",");
                    break;
                  case "28":
                    horarios_martes += (arr[2] + ":" + arr[3] + ",");
                    break;
                  case "29":
                    horarios_miercoles += (arr[2] + ":" + arr[3] + ",");
                    break;
                  case "30":
                    horarios_jueves += (arr[2] + ":" + arr[3] + ",");
                    break;
                  case "31":
                    horarios_viernes += (arr[2] + ":" + arr[3] + ",");
                    break;
                  default:

                }
              }
              $('#musculacion_lunes').val(horarios_lunes);
              $('#musculacion_martes').val(horarios_martes);
              $('#musculacion_miercoles').val(horarios_miercoles);
              $('#musculacion_jueves').val(horarios_jueves);
              $('#musculacion_viernes').val(horarios_viernes);
            });
          });
});

$('#musculacion_button').click(function() {
  var authSufix = "";
  var loginUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo";
  var response = $.post(loginUrl, {
            "email": "ignalau@iltempo.com",
            "password": "contraseña123",
            "returnSecureToken": true,
          },function(data, status, jqXHR) {
            authSufix = "auth=" + data["idToken"];
            schedule = ',"horario":{';
            var arr_lunes = $('#musculacion_lunes').val().split(",");
            var arr_martes = $('#musculacion_martes').val().split(",");
            var arr_miercoles = $('#musculacion_miercoles').val().split(",");
            var arr_jueves = $('#musculacion_jueves').val().split(",");
            var arr_viernes = $('#musculacion_viernes').val().split(",");
            var count = 0;
            for(var horario of arr_lunes) {
              if(horario == "") continue;
              var arr = horario.split(":");
              schedule += '"' +count + '":"4.27.' + arr[0] + '.' + arr[1] + '",';
              count++;
            }
            for(var horario of arr_martes) {
              if(horario == "") continue;
              var arr = horario.split(":");
              schedule += '"' +count + '":"4.28.' + arr[0] + '.' + arr[1] + '",';
              count++;
            }
            for(var horario of arr_miercoles) {
              if(horario == "") continue;
              var arr = horario.split(":");
              schedule += '"' +count + '":"4.29.' + arr[0] + '.' + arr[1] + '",';
              count++;
            }
            for(var horario of arr_jueves) {
              if(horario == "") continue;
              var arr = horario.split(":");
              schedule += '"' +count + '":"4.30.' + arr[0] + '.' + arr[1] + '",';
              count++;
            }
            for(var horario of arr_viernes) {
              if(horario == "") continue;
              var arr = horario.split(":");
              schedule += '"' +count + '":"4.31.' + arr[0] + '.' + arr[1] + '",';
              count++;
            }
            schedule = schedule.substr(0,schedule.length-1);
            schedule += '}';
            var patchData = '{"profesor":"' + $('#musculacion_teacher').val() + '","duration":"' + $('#musculacion_duration').val() + '","descripcion":"' + $('#musculacion_description').val() + '","maxSchedules":' + $('#musculacion_max').val() + schedule +'}';
            // Musculación
            $.ajax({
              url: 'https://il-tempo-dda8e.firebaseio.com/trainings/Musculacion.json?'+ authSufix,
              type: "PATCH",
              data: patchData,
            });
          });
})
