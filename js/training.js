const updateTraining = (token) => {
  var currentTraining = getCurrentTraining();
  var dbName = currentTraining.charAt(0).toUpperCase() + currentTraining.slice(1);
  if (dbName == "Funcional") dbName = "Funcional Grupal";
  if (dbName == "Musculacion") dbName = "Musculación";
  if (dbName == "Zumba") dbName = "Ritmos";
  authSufix = "auth=" + token;
  schedule = ',"horario":{';
  var arr_days = [
    $('#' + currentTraining + '_lunes').val().split(","),
    $('#' + currentTraining + '_martes').val().split(","),
    $('#' + currentTraining + '_miercoles').val().split(","),
    $('#' + currentTraining + '_jueves').val().split(","),
    $('#' + currentTraining + '_viernes').val().split(","),
    $('#' + currentTraining + '_sabado').val().split(","),
    $('#' + currentTraining + '_domingo').val().split(","),
  ];
  var count = 0;
  for (var i = 0; i < arr_days.length; i++) {
    for (var horario of arr_days[i]) {
      if (horario == "") continue;
      if (horario.includes("a")) {
        var horarios = horario.split(" a ");
        var first = horarios[0].split(":");
        var second = horarios[1].split(":");
        schedule += '"' + count + '":"4.' + (20 + i) + '.' + first[0] + '.' + first[1] + 'a' + '4.' + (20 + i) + '.' + second[0] + '.' + second[1] + '",';
        count++;
      } else {
        var arr = horario.split(":");
        schedule += '"' + count + '":"4.' + (20 + i) + '.' + arr[0] + '.' + arr[1] + '",';
        count++;
      }
    }
  }
  if (schedule[schedule.length - 1] != "{") schedule = schedule.substr(0, schedule.length - 1);
  schedule += '}';
  var patchData = '{"intervalo":"' + $('#' + currentTraining + '_duration_mins').val() + '","profesor":"' + $('#' + currentTraining + '_teacher').val() + '","duration":"' + $('#' + currentTraining + '_duration').val() + '","descripcion":"' + $('#' + currentTraining + '_description').val() + '","maxSchedules":' + $('#' + currentTraining + '_max').val() + schedule;
  if (currentTraining == "musculacion") {
    patchData += ',"freeGymMaxSchedules":' + $('#musculacion_free_max').val() + "}";
  } else {
    patchData += "}";
  }

  $.ajax({
    url: 'https://il-tempo-dda8e.firebaseio.com/trainings/' + dbName + '.json?' + authSufix,
    type: "PATCH",
    data: patchData,
    success: function (data) {
      alert("La información de la clase ha sido actualizada correctamente");
    },
    error: function (data) {
      alert("Lo sentimos, hubo un error al actualizar la información");
    }
  });
}


const getTraining = (token) => {
  var currentTraining = getCurrentTraining();
  var dbName = currentTraining.charAt(0).toUpperCase() + currentTraining.slice(1);
  if (dbName == "Funcional") dbName = "Funcional Grupal";
  if (dbName == "Musculacion") dbName = "Musculación";
  if (dbName == "Zumba") dbName = "Ritmos";
  var authSufix = "auth=" + token;
  const url = 'https://il-tempo-dda8e.firebaseio.com/trainings/' + dbName + '.json?' + authSufix;
  $.getJSON(url, function (data) {
    $('#' + currentTraining + '_teacher').val(data["profesor"]);
    $('#' + currentTraining + '_description').val(data["descripcion"]);
    $('#' + currentTraining + '_max').val(data["maxSchedules"]);
    $('#' + currentTraining + '_duration').val(data["duration"]);
    $('#' + currentTraining + '_duration_mins').val(data["intervalo"]);

    if (currentTraining == "musculacion") {
      $('#musculacion_free_max').val(data["freeGymMaxSchedules"]);
    }

    var horarios_lunes = "";
    var horarios_martes = "";
    var horarios_miercoles = "";
    var horarios_jueves = "";
    var horarios_viernes = "";
    var horarios_sabados = "";
    var horarios_domingos = "";
    if (data["horario"] != null) {
      for (var horario of data["horario"]) {
        if (horario.includes("a")) {
          var horarios = horario.split("a");
          var first = horarios[0].split(".");
          var second = horarios[1].split(".");
          switch (first[1]) {
            case "20":
              horarios_lunes += (first[2] + ":" + first[3] + " a " + second[2] + ":" + second[3] + ",");
              break;
            case "21":
              horarios_martes += (first[2] + ":" + first[3] + " a " + second[2] + ":" + second[3] + ",");
              break;
            case "22":
              horarios_miercoles += (first[2] + ":" + first[3] + " a " + second[2] + ":" + second[3] + ",");
              break;
            case "23":
              horarios_jueves += (first[2] + ":" + first[3] + " a " + second[2] + ":" + second[3] + ",");
              break;
            case "24":
              horarios_viernes += (first[2] + ":" + first[3] + " a " + second[2] + ":" + second[3] + ",");
              break;
            case "25":
              horarios_sabados += (first[2] + ":" + first[3] + " a " + second[2] + ":" + second[3] + ",");
              break;
            case "26":
              horarios_domingos += (first[2] + ":" + first[3] + " a " + second[2] + ":" + second[3] + ",");
              break;
            default:
          }
        } else {
          var arr = horario.split(".");
          if (arr[3].length == 1) arr[3] += "0";
          switch (arr[1]) {
            case "20":
              horarios_lunes += (arr[2] + ":" + arr[3] + ",");
              break;
            case "21":
              horarios_martes += (arr[2] + ":" + arr[3] + ",");
              break;
            case "22":
              horarios_miercoles += (arr[2] + ":" + arr[3] + ",");
              break;
            case "23":
              horarios_jueves += (arr[2] + ":" + arr[3] + ",");
              break;
            case "24":
              horarios_viernes += (arr[2] + ":" + arr[3] + ",");
              break;
            case "25":
              horarios_sabados += (arr[2] + ":" + arr[3] + ",");
              break;
            case "25":
              horarios_domingos += (arr[2] + ":" + arr[3] + ",");
              break;
            default:
          }
        }
      }
      $('#' + currentTraining + '_lunes').val(horarios_lunes);
      $('#' + currentTraining + '_martes').val(horarios_martes);
      $('#' + currentTraining + '_miercoles').val(horarios_miercoles);
      $('#' + currentTraining + '_jueves').val(horarios_jueves);
      $('#' + currentTraining + '_viernes').val(horarios_viernes);
      $('#' + currentTraining + '_sabado').val(horarios_sabados);
      $('#' + currentTraining + '_domingo').val(horarios_domingos);
    }

  });
}

$(document).ready(function () {
  var token = getCookie("token");
  if (token == "") {
    var loginUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo";
    var response = $.post(loginUrl, {
      "email": "test@iltempo.com",
      "password": "contraseña123",
      "returnSecureToken": true,
    }, function (data, status, jqXHR) {
      token = data["idToken"];
      setCookie("token", token, data["expiresIn"]);
      getTraining(token);
    });
  } else {
    getTraining(token);
  }
});

$('#' + getCurrentTraining() + '_button').click(function () {
  var token = getCookie("token");
  if (token == "") {
    var loginUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo";
    var response = $.post(loginUrl, {
      "email": "test@iltempo.com",
      "password": "contraseña123",
      "returnSecureToken": true,
    }, function (data, status, jqXHR) {
      token = data["idToken"];
      setCookie("token", token, data["expiresIn"]);
      updateTraining(token);
    });
  } else {
    updateTraining(token);
  }
});
