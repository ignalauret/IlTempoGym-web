const getCurrentTraining = () => {
  var currentPath = window.location.pathname;
  var splittedPath = currentPath.split("/");
  var currentTraining = splittedPath[splittedPath.length - 1].split(".")[0];
  return currentTraining;
}


const updateTraining = (token) => {
  var currentTraining = getCurrentTraining();
  var dbName = currentTraining.charAt(0).toUpperCase() + currentTraining.slice(1);
  authSufix = "auth=" + token;
  schedule = ',"horario":{';
  var arr_days = [
    $('#' + currentTraining + '_lunes').val().split(","),
    $('#' + currentTraining + '_martes').val().split(","),
    $('#' + currentTraining + '_miercoles').val().split(","),
    $('#' + currentTraining + '_jueves').val().split(","),
    $('#' + currentTraining + '_viernes').val().split(","),
  ];
  var count = 0;
  for(var i = 0; i < arr_days.length; i++) {
    for(var horario of arr_days[i]) {
      if(horario == "") continue;
      if(horario.includes("a")) {
        var horarios = horario.split(" a ");
        var first = horarios[0].split(":");
        var second = horarios[1].split(":");
        schedule += '"' + count + '":"4.' + (27+i) + '.' + first[0] + '.' + first[1] + 'a' + '4.27.' + second[0] + '.' + second[1] + '",';
        count++;
      } else {
        var arr = horario.split(":");
        schedule += '"' +count + '":"4.'  + (27+i) + '.' + arr[0] + '.' + arr[1] + '",';
        count++;
      }
    }
  }
  schedule = schedule.substr(0,schedule.length-1);
  schedule += '}';
  var patchData = '{"profesor":"' + $('#' + currentTraining + '_teacher').val() + '","duration":"' + $('#' + currentTraining + '_duration').val() + '","descripcion":"' + $('#' + currentTraining + '_description').val() + '","maxSchedules":' + $('#' + currentTraining + '_max').val() + schedule +'}';
  // Musculación
  $.ajax({
    url: 'https://il-tempo-dda8e.firebaseio.com/trainings/' + dbName + '.json?'+ authSufix,
    type: "PATCH",
    data: patchData,
  });
}


const getTraining = (token) => {
  var currentTraining = getCurrentTraining();
  var dbName = currentTraining.charAt(0).toUpperCase() + currentTraining.slice(1);
  var authSufix = "auth=" + token;
  const url = 'https://il-tempo-dda8e.firebaseio.com/trainings/' + dbName + '.json?'+ authSufix;
  $.getJSON(url, function(data) {
    $('#' + currentTraining + '_teacher').val(data["profesor"]);
    $('#' + currentTraining + '_description').val(data["descripcion"]);
    $('#' + currentTraining + '_max').val(data["maxSchedules"]);
    $('#' + currentTraining + '_duration').val(data["duration"]);
    var horarios_lunes = "";
    var horarios_martes = "";
    var horarios_miercoles = "";
    var horarios_jueves = "";
    var horarios_viernes = "";
    for(var horario of data["horario"]) {
      if(horario.includes("a")) {
        var horarios = horario.split("a");
        var first = horarios[0].split(".");
        var second = horarios[1].split(".");
        switch (first[1]) {
          case "27":
            horarios_lunes += (first[2] + ":" + first[3] + " a " + second[2] + ":" + second[3] + ",");
            break;
          case "28":
            horarios_martes += (first[2] + ":" + first[3] + " a " + second[2] + ":" + second[3] + ",");
            break;
          case "29":
            horarios_miercoles += (first[2] + ":" + first[3] + " a " + second[2] + ":" + second[3] + ",");
            break;
          case "30":
            horarios_jueves += (first[2] + ":" + first[3] + " a " + second[2] + ":" + second[3] + ",");
            break;
          case "31":
            horarios_viernes += (first[2] + ":" + first[3] + " a " + second[2] + ":" + second[3] + ",");
            break;
          default:
        }
      } else {
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
    }
    $('#' + currentTraining + '_lunes').val(horarios_lunes);
    $('#' + currentTraining + '_martes').val(horarios_martes);
    $('#' + currentTraining + '_miercoles').val(horarios_miercoles);
    $('#' + currentTraining + '_jueves').val(horarios_jueves);
    $('#' + currentTraining + '_viernes').val(horarios_viernes);
});
}

$(document).ready(function() {
  var token = getCookie("token");
  if(token == "") {
    var loginUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo";
    var response = $.post(loginUrl, {
              "email": "test@iltempo.com",
              "password": "contraseña123",
              "returnSecureToken": true,
            },function(data, status, jqXHR) {
              token = data["idToken"];
              setCookie("token", token, data["expiresIn"]);
              getTraining(token);
            });
  } else {
    getTraining(token);
  }
});

$('#' + getCurrentTraining() + '_button').click(function() {
  var token = getCookie("token");
  if(token == "") {
    var loginUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo";
    var response = $.post(loginUrl, {
              "email": "test@iltempo.com",
              "password": "contraseña123",
              "returnSecureToken": true,
            },function(data, status, jqXHR) {
              token = data["idToken"];
              setCookie("token", token, data["expiresIn"]);
              updateTraining(token);
            });
  } else {
    updateTraining(token);
  }
})
