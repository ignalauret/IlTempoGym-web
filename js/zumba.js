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
            $.getJSON('https://il-tempo-dda8e.firebaseio.com/trainings/Zumba.json?'+ authSufix, function(data) {
              $('#zumba_teacher').val(data["profesor"]);
              $('#zumba_description').val(data["descripcion"]);
              $('#zumba_max').val(data["maxSchedules"]);
              $('#zumba_duration').val(data["duration"]);
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
              $('#zumba_lunes').val(horarios_lunes);
              $('#zumba_martes').val(horarios_martes);
              $('#zumba_miercoles').val(horarios_miercoles);
              $('#zumba_jueves').val(horarios_jueves);
              $('#zumba_viernes').val(horarios_viernes);
            });
          });
});

$('#zumba_button').click(function() {
  var authSufix = "";
  var loginUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo";
  var response = $.post(loginUrl, {
            "email": "ignalau@iltempo.com",
            "password": "contraseña123",
            "returnSecureToken": true,
          },function(data, status, jqXHR) {
            authSufix = "auth=" + data["idToken"];
            schedule = ',"horario":{';
            var arr_lunes = $('#zumba_lunes').val().split(",");
            var arr_martes = $('#zumba_martes').val().split(",");
            var arr_miercoles = $('#zumba_miercoles').val().split(",");
            var arr_jueves = $('#zumba_jueves').val().split(",");
            var arr_viernes = $('#zumba_viernes').val().split(",");
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
            var patchData = '{"profesor":"' + $('#zumba_teacher').val() + '","duration":"' + $('#zumba_duration').val() + '","descripcion":"' + $('#zumba_description').val() + '","maxSchedules":' + $('#zumba_max').val() + schedule +'}';
            // Musculación
            $.ajax({
              url: 'https://il-tempo-dda8e.firebaseio.com/trainings/Zumba.json?'+ authSufix,
              type: "PATCH",
              data: patchData,
            });
          });
})
