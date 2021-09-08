const addClient = (token, name, dni, telefono, contacto, direccion, obraSocial, nacimiento, password) => {
  // Build auth sufix with token
  var authSuffix = "auth=" + token;
  $.ajax({
    url: "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo",
    type: "POST",
    headers: { 'Content-Type': 'application/json', },
    data: '{"email":"' + dni + "@iltempo.com" + '","password":"' + password + '","returnSecureToken": false}',
    success: function (data) {
      if (data != null) {
        var uid = data["localId"];
        var patchData = '{';
        if (dni.length) patchData += '"dni":"' + dni + '",';
        if (name.length) patchData += '"nombre":"' + name + '",';
        if (telefono.length) patchData += '"telefono":"' + telefono + '",';
        if (contacto.length) patchData += '"contacto":"' + contacto + '",';
        if (direccion.length) patchData += '"direccion":"' + direccion + '",';
        if (obraSocial.length) patchData += '"obraSocial":"' + obraSocial + '",';
        if (nacimiento.length) patchData += '"nacimiento":"' + nacimiento + '",';
        if (password.length) patchData += '"psw":"' + password + '",';
        // Take the last comma
        if (patchData[patchData.length - 1] != "{") patchData = patchData.substr(0, patchData.length - 1);
        patchData += '}';
        //var patchData = '{"dni":"' + dni + '","nombre":"' + name + '","telefono":"' + telefono + '","contacto":"' + contacto + '","direccion":"' + direccion + '","obraSocial":"' + obraSocial + '","nacimiento":"' + nacimiento + '","psw":"' + password + '"}';
        // Musculación
        $.ajax({
          url: 'https://il-tempo-dda8e.firebaseio.com/usuarios/' + uid + '.json?' + authSuffix,
          type: "PATCH",
          data: patchData,
          success: function (data) {
            alert("El usuario " + name + " ha sido agregado correctamente.");
          }
        });
      }
    },
    error: function (xhr, status, error) {
      alert("Lo sentimos, hubo un error.")
    }
  });
}

const editClient = (token, uid, name, dni, telefono, contacto, direccion, obraSocial, nacimiento) => {
  // Build auth sufix with token
  var authSufix = "auth=" + token;
  var patchData = '{';
  if (dni.length) patchData += '"dni":"' + dni + '",';
  if (name.length) patchData += '"nombre":"' + name + '",';
  if (telefono.length) patchData += '"telefono":"' + telefono + '",';
  if (contacto.length) patchData += '"contacto":"' + contacto + '",';
  if (direccion.length) patchData += '"direccion":"' + direccion + '",';
  if (obraSocial.length) patchData += '"obraSocial":"' + obraSocial + '",';
  if (nacimiento.length) patchData += '"nacimiento":"' + nacimiento + '",';
  // Take the last comma
  if (patchData[patchData.length - 1] != "{") patchData = patchData.substr(0, patchData.length - 1);
  patchData += '}';

  $.ajax({
    url: 'https://il-tempo-dda8e.firebaseio.com/usuarios/' + uid + '.json?' + authSufix,
    type: "PATCH",
    data: patchData,
    success: function (data) {
      alert("El usuario " + name + " ha sido editado correctamente.");
    }
  });
}

const getClients = (token) => {
  // Build auth sufix with token
  var authSufix = "auth=" + token;
  // Get all turns.
  $.getJSON('https://il-tempo-dda8e.firebaseio.com/usuarios.json?' + authSufix, function (data) {
    if (data == null) return;
    var dataSet = [];
    dataArray = Object.values(data);
    idArray = Object.keys(data);
    for (var i = 0; i < dataArray.length; i++) {
      var vencimiento = dataArray[i].vencimiento;
      if (!vencimiento) vencimiento = "No registrado";

      var telefono = dataArray[i].telefono;
      if (!telefono) telefono = "No registrado";

      var contacto = dataArray[i].contacto;
      if (!contacto) contacto = "No registrado";

      var direccion = dataArray[i].direccion;
      if (!direccion) direccion = "No registrado";

      var obraSocial = dataArray[i].obraSocial;
      if (!obraSocial) obraSocial = "No registrado";

      var nacimiento = dataArray[i].nacimiento;
      if (!nacimiento) nacimiento = "No registrado";

      dataSet.push([idArray[i], dataArray[i].nombre, dataArray[i].dni, vencimiento, telefono, contacto, direccion, obraSocial, nacimiento, dataArray[i].psw]);
    }

    $('#users_table').DataTable({
      data: dataSet,
      columns: [
        { title: "ID" },
        { title: "Nombre" },
        { title: "Dni" },
        { title: "Vencimiento" },
        { title: "Teléfono" },
        { title: "Contacto" },
        { title: "Dirección" },
        { title: "Obra Social" },
        { title: "Nacimiento" },
        { title: "Contraseña" },
      ]
    });
  });
}

const deleteUserWithDni = (token, dni, psw) => {
  // Build auth sufix with token
  var authSufix = "auth=" + token;
  // Login user to get token
  var loginUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo";
  $.post(loginUrl, {
    "email": dni + "@iltempo.com",
    "password": psw,
    "returnSecureToken": true,
  }, function (authData, status, jqXHR) {
    // Delete user from Auth
    idToken = authData["idToken"];
    $.ajax({
      url: "https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo",
      type: "POST",
      headers: { 'Content-Type': 'application/json', },
      data: '{"idToken":"' + idToken + '"}',
      success: function (data) {
        // Delete user data from db
        $.ajax({
          url: 'https://il-tempo-dda8e.firebaseio.com/usuarios/' + authData["localId"] + '.json?' + authSufix,
          type: "DELETE",
          success: function (data) {
            alert("El usuario con dni " + dni + " ha sido eliminado.");
          }
        });
      },
      error: function (xhr, status, error) {
        console.log(eval("(" + xhr.responseText + ")"));
      }
    });
  });
};

const deleteClient = (token, id) => {
  // Build auth sufix with token
  var authSufix = "auth=" + token;
  // Get user mail and password
  if (id == "") {
    return;
  }
  $.ajax({
    url: 'https://il-tempo-dda8e.firebaseio.com/usuarios/' + id + '.json?' + authSufix,
    type: "GET",
    error: function (xhr, status, error) {
      alert("Lo sentimos, hubo un error.");
    },
    success: function (userData) {
      if (userData == null) {
        alert("Lo sentimos, el Id no existe.");
        return;
      }
      // Login user to get token
      var loginUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo";
      $.post(loginUrl, {
        "email": userData["dni"] + "@iltempo.com",
        "password": userData["psw"],
        "returnSecureToken": true,
      }, function (authData, status, jqXHR) {
        // Delete user from Auth
        idToken = authData["idToken"];
        $.ajax({
          url: "https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo",
          type: "POST",
          headers: { 'Content-Type': 'application/json', },
          data: '{"idToken":"' + idToken + '"}',
          success: function (data) {
            // Delete user data from db
            $.ajax({
              url: 'https://il-tempo-dda8e.firebaseio.com/usuarios/' + id + '.json?' + authSufix,
              type: "DELETE",
              success: function (data) {
                alert("El usuario " + userData["nombre"] + " ha sido eliminado.");
              }
            });
          },
          error: function (xhr, status, error) {
            console.log(eval("(" + xhr.responseText + ")"));
          }
        });
      });
    }
  });
}


$(document).ready(function () {
  var token = getCookie("token");
  if (token == "") {
    var loginUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo";
    var response = $.post(loginUrl, {
      "email": "ignalau@iltempo.com",
      "password": "contraseña123",
      "returnSecureToken": true,
    }, function (data, status, jqXHR) {
      setCookie("token", data["idToken"], data["expiresIn"]);
      getClients(data["idToken"]);
    });
  } else {
    getClients(token);
  }
});

$('#add_button').click(function () {
  var token = getCookie("token");
  var name = $('#add_name').val();
  var dni = $('#add_dni').val();
  var telefono = $('#add_telefono').val();
  var contacto = $('#add_contacto').val();
  var direccion = $('#add_direccion').val();
  var obraSocial = $('#add_obraSocial').val();
  var nacimiento = $('#add_nacimiento').val();
  var password = $('#add_password').val();
  if (dni.length == 0 || password.length == 0 || name.length == 0) return;
  if (token == "") {
    var loginUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo";
    var response = $.post(loginUrl, {
      "email": "test@iltempo.com",
      "password": "contraseña123",
      "returnSecureToken": true,
    }, function (data, status, jqXHR) {
      token = data["idToken"];
      setCookie("token", token, data["expiresIn"]);
      addClient(token, name, dni, telefono, contacto, direccion, obraSocial, nacimiento, password);
    });
  } else {
    addClient(token, name, dni, telefono, contacto, direccion, obraSocial, nacimiento, password);
  }
});

$('#delete_button').click(function () {
  var token = getCookie("token");
  var dni = $('#delete_dni').val();
  var psw = $('#delete_password').val();
  if (dni.length == 0 || psw.length == 0) return;
  if (token == "") {
    var loginUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo";
    var response = $.post(loginUrl, {
      "email": "ignalau@iltempo.com",
      "password": "contraseña123",
      "returnSecureToken": true,
    }, function (data, status, jqXHR) {
      setCookie("token", data["idToken"], data["expiresIn"]);
      deleteUserWithDni(data["idToken"], dni, psw);
    });
  } else {
    deleteUserWithDni(token, dni, psw);
  }
});

$('#edit_button').click(function () {
  var token = getCookie("token");
  var uid = $('#edit_id').val();
  var name = $('#edit_name').val();
  var dni = $('#edit_dni').val();
  var telefono = $('#edit_telefono').val();
  var contacto = $('#edit_contacto').val();
  var direccion = $('#edit_direccion').val();
  var obraSocial = $('#edit_obraSocial').val();
  var nacimiento = $('#edit_nacimiento').val();
  if (uid.length == 0) return;
  if (token == "") {
    var loginUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo";
    var response = $.post(loginUrl, {
      "email": "test@iltempo.com",
      "password": "contraseña123",
      "returnSecureToken": true,
    }, function (data, status, jqXHR) {
      token = data["idToken"];
      setCookie("token", token, data["expiresIn"]);
      editClient(token, uid, name, dni, telefono, contacto, direccion, obraSocial, nacimiento);
    });
  } else {
    editClient(token, uid, name, dni, telefono, contacto, direccion, obraSocial, nacimiento);
  }
});
