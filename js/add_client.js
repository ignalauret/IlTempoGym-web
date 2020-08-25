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

const addClient = (token, name, dni, password) => {
  // Build auth sufix with token
  var authSufix = "auth=" + token;
  $.ajax({
    url: "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo",
    type: "POST",
    headers: {'Content-Type': 'application/json',},
    data: '{"email":"' + dni + "@iltempo.com" + '","password":"' + password + '","returnSecureToken": false}',
    success: function(data) {
      if(data != null) {
        var uid = data["localId"];
        var patchData = '{"dni":"' + dni + '","nombre":"' + name + '","psw":"' + password + '"}';
        // Musculación
        $.ajax({
          url: 'https://il-tempo-dda8e.firebaseio.com/usuarios/' + uid + '.json?'+ authSufix,
          type: "PATCH",
          data: patchData,
          success: function(data) {
            alert("El usuario " + name + " ha sido agregado correctamente.");
          }
        });
      }
    },
    error: function(xhr, status, error) {
      alert("Lo sentimos, hubo un error.")
    }
  });
}

const getClients = (token) => {
  // Build auth sufix with token
  var authSufix = "auth=" + token;
  // Get all turns.
  $.getJSON('https://il-tempo-dda8e.firebaseio.com/usuarios.json?' + authSufix, function(data) {
    if(data == null) return;
    var dataSet = [];
    dataArray = Object.values(data);
    idArray = Object.keys(data);
    for(var i = 0; i < dataArray.length; i++) {
      dataSet.push([idArray[i], dataArray[i].nombre, dataArray[i].dni]);
    }

    $('#users_table').DataTable( {
        data: dataSet,
        columns: [
            { title: "ID" },
            { title: "Nombre" },
            { title: "Dni" },
          ]
    });
  });
}

const deleteClient = (token, id) => {
  // Build auth sufix with token
  var authSufix = "auth=" + token;
  // Get user mail and password
  if(id == "") {
    return;
  }
  $.ajax({
    url: 'https://il-tempo-dda8e.firebaseio.com/usuarios/' + id + '.json?' + authSufix,
    type: "GET",
    error: function(xhr, status, error) {
      alert("Lo sentimos, hubo un error.");
    },
    success: function(userData) {
      if(userData == null) {
        alert("Lo sentimos, el Id no existe.");
        return;
      }
      // Login user to get token
      var loginUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo";
      $.post(loginUrl, {
                "email": userData["dni"] + "@iltempo.com",
                "password": userData["psw"],
                "returnSecureToken": true,
              },function(authData, status, jqXHR) {
                // Delete user from Auth
                idToken = authData["idToken"];
                $.ajax({
                  url: "https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo",
                  type: "POST",
                  headers: {'Content-Type': 'application/json',},
                  data: '{"idToken":"' + idToken + '"}',
                  success: function(data) {
                    // Delete user data from db
                    $.ajax({
                      url: 'https://il-tempo-dda8e.firebaseio.com/usuarios/' + id + '.json?' + authSufix,
                      type: "DELETE",
                      success: function(data) {
                        alert("El usuario " + userData["nombre"] + " ha sido eliminado.");
                      }
                    });
                  },
                  error: function(xhr, status, error) {
                    console.log(eval("(" + xhr.responseText + ")"));
                  }
                });
              });
    }
  });
}


$(document).ready(function() {
  var token = getCookie("token");
  if(token == "") {
    var loginUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo";
    var response = $.post(loginUrl, {
              "email": "ignalau@iltempo.com",
              "password": "contraseña123",
              "returnSecureToken": true,
            },function(data, status, jqXHR) {
              setCookie("token", data["idToken"], data["expiresIn"]);
              getClients(data["idToken"]);
            });
  } else {
    getClients(token);
  }
});

$('#add_button').click(function() {
  var token = getCookie("token");
  var name = $('#add_name').val();
  var dni = $('#add_dni').val();
  var password = $('#add_password').val();
  if(token == "") {
    var loginUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo";
    var response = $.post(loginUrl, {
              "email": "test@iltempo.com",
              "password": "contraseña123",
              "returnSecureToken": true,
            },function(data, status, jqXHR) {
              token = data["idToken"];
              setCookie("token", token, data["expiresIn"]);
              addClient(token, name, dni, password);
            });
  } else {
    addClient(token, name, dni, password);
  }
});

$('#delete_button').click(function() {
  var token = getCookie("token");
  var id = $('#delete_id').val();
  if (id == "") return;
  if(token == "") {
    var loginUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo";
    var response = $.post(loginUrl, {
              "email": "test@iltempo.com",
              "password": "contraseña123",
              "returnSecureToken": true,
            },function(data, status, jqXHR) {
              token = data["idToken"];
              setCookie("token", token, data["expiresIn"]);
              deleteClient(token, id);
            });
  } else {
    deleteClient(token, id);
  }
});
