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
            $.getJSON('https://il-tempo-dda8e.firebaseio.com/trainings/Spinning.json?'+ authSufix, function(data) {
              $('#spinning_teacher').val(data["profesor"]);
              $('#spinning_description').val(data["descripcion"]);
              $('#spinning_max').val(data["maxSchedules"]);
              $('#spinning_duration').val(data["duration"]);
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
              $('#spinning_lunes').val(horarios_lunes);
              $('#spinning_martes').val(horarios_martes);
              $('#spinning_miercoles').val(horarios_miercoles);
              $('#spinning_jueves').val(horarios_jueves);
              $('#spinning_viernes').val(horarios_viernes);
            });
          });
});

$('#spinning_button').click(function() {
  var authSufix = "";
  var loginUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo";
  var response = $.post(loginUrl, {
            "email": "ignalau@iltempo.com",
            "password": "contraseña123",
            "returnSecureToken": true,
          },function(data, status, jqXHR) {
            authSufix = "auth=" + data["idToken"];
            schedule = ',"horario":{';
            var arr_lunes = $('#spinning_lunes').val().split(",");
            var arr_martes = $('#spinning_martes').val().split(",");
            var arr_miercoles = $('#spinning_miercoles').val().split(",");
            var arr_jueves = $('#spinning_jueves').val().split(",");
            var arr_viernes = $('#spinning_viernes').val().split(",");
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
            var patchData = '{"profesor":"' + $('#spinning_teacher').val() + '","duration":"' + $('#spinning_duration').val() + '","descripcion":"' + $('#spinning_description').val() + '","maxSchedules":' + $('#spinning_max').val() + schedule +'}';
            // Musculación
            $.ajax({
              url: 'https://il-tempo-dda8e.firebaseio.com/trainings/Spinning.json?'+ authSufix,
              type: "PATCH",
              data: patchData,
            });
          });
})
