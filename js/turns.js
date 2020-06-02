const setCookie = (cname, cvalue, exseconds) => {
  var d = new Date();
  d.setTime(d.getTime() + (exseconds*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const getCookie = (cname) => {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
      }
  }
  return "";
}

const getTurns = (token) => {
  // Get current training
  var currentPath = window.location.pathname;
  var splittedPath = currentPath.split("/");
  var currentTraining = splittedPath[splittedPath.length - 1].split(".")[0];
  if(currentTraining == "index") {
    currentTraining = "all";
  }
  var dbName = currentTraining.charAt(0).toUpperCase() + currentTraining.slice(1);
  // Get dates for query
  var date = new Date();
  var day_today = date.getDate();
  var month_today = date.getMonth() + 1;
  var today = day_today.toString() + "/" + month_today.toString();
  var month_tomorrow = month_today;
  var day_tomorrow = day_today + 1;
  // TODO: Dates fix.
  if(day_tomorrow == 32) {
    day_tomorrow = 1;
    month_tomorrow++;
  }
  var tomorrow = day_tomorrow.toString() + "/" + month_tomorrow.toString();
  var authSufix = "auth=" + token;
  // Get todays turns.
  $.getJSON('https://il-tempo-dda8e.firebaseio.com/turnos.json?orderBy="fecha"&equalTo="' + today + '"&' + authSufix, function(data) {
    if(data == null) return;
    var dataSet = [];
    dataArray = Object.values(data);
    for(var turno of dataArray) {
      if(turno.clase == dbName || dbName == "All"){
        dataSet.push([turno.nombre, turno.dni, turno.clase, turno.dia, turno.hora, turno.fecha]);
      }
    }

    $('#' + currentTraining + '_today').DataTable( {
        data: dataSet,
        columns: [
            { title: "Nombre" },
            { title: "Dni" },
            { title: "Clase" },
            { title: "Dia" },
            { title: "Horario" },
            { title: "Fecha" }        ]
    } );
  });
  // Get all turns.
  $.getJSON('https://il-tempo-dda8e.firebaseio.com/turnos.json?' + authSufix, function(data) {
    if(data == null) return;
    var dataSet = [];
    dataArray = Object.values(data);
    for(var turno of dataArray) {
      if(turno.clase == dbName|| dbName == "All"){
        dataSet.push([turno.nombre, turno.dni, turno.clase, turno.dia, turno.hora, turno.fecha]);
      }
    }
    $('#' + currentTraining + '_tomorrow').DataTable( {
        data: dataSet,
        columns: [
            { title: "Nombre" },
            { title: "Dni" },
            { title: "Clase" },
            { title: "Dia" },
            { title: "Horario" },
            { title: "Fecha" }        ]
    });
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
              setCookie("token", data["idToken"], data["expiresIn"]);
              getTurns(data["idToken"]);
            });
  } else {
    getTurns(token);
  }

});
