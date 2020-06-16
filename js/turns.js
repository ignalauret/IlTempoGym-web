const getCurrentTraining = () => {
  var currentPath = window.location.pathname;
  var splittedPath = currentPath.split("/");
  var currentTraining = splittedPath[splittedPath.length - 1].split(".")[0];
  if(currentTraining == "index") {
    currentTraining = "all";
  }
  return currentTraining;
}

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
  // Build auth sufix with token
  var authSufix = "auth=" + token;
  // Get current training
  var currentTraining = getCurrentTraining();
  var dbName = currentTraining.charAt(0).toUpperCase() + currentTraining.slice(1);
  // Get dates for query
  const date_today = new Date();
  var day_today = date_today.getDate();
  var month_today = date_today.getMonth() + 1;
  var today = day_today.toString() + "/" + month_today.toString();

  const date_tomorrow = new Date(today)
  date_tomorrow.setDate(date_tomorrow.getDate() + 1)
  var month_tomorrow = date_tomorrow.getMonth();
  var day_tomorrow = date_tomorrow.getDate();
  var tomorrow = day_tomorrow.toString() + "/" + month_tomorrow.toString();

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

const is_before = (date1, date2) => {
  const arr1 = date1.split("/");
  const arr2 = date2.split("/");
  if(parseInt(arr1[1]) < parseInt(arr2[1])) return true;
  if(parseInt(arr1[1]) > parseInt(arr2[1])) return false;
  if(parseInt(arr1[0]) < parseInt(arr2[0])) return true;
  return false;
}

const clear_db = (token) => {
  var authSufix = "auth=" + token;
  $.getJSON('https://il-tempo-dda8e.firebaseio.com/turnos.json?' + authSufix, function(data) {
    if(data == null) return;
    var dataSet = [];
    const today = new Date();
    const parsed_today = today.getDate() + "/" + (today.getMonth() + 1);
    dataArray = Object.values(data);
    idArray = Object.keys(data);
    for(var i = 0; i < dataArray.length; i++) {
      var fecha = dataArray[i].fecha;
      console.log(fecha);
      console.log(parsed_today);
      if(is_before(fecha, parsed_today)) {
        console.log("Entro");
        $.ajax({
          url: 'https://il-tempo-dda8e.firebaseio.com/turnos/'+ idArray[i] +'.json?'+ authSufix,
          type: "DELETE",
          success: function(result) {
            console.log(result);
          }
        });
      }
    }
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

$('#clear_button').click(function() {
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
              clear_db(token);
            });
  } else {
    clear_db(token);
  }
});
