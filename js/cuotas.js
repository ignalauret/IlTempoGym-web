$(document).ready(function () {
  $('#start_date').val(getToday());
  $('#end_date').val(getToday());
  $('#add_cuota_fecha').val(getToday());
  $('#add_cuota_monto').val("0");
  var token = getCookie("token");
  if (token == "") {
    var loginUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo";
    var response = $.post(loginUrl, {
      "email": "test@iltempo.com",
      "password": "contraseña123",
      "returnSecureToken": true,
    }, function (data, status, jqXHR) {
      setCookie("token", data["idToken"], data["expiresIn"]);
      getCuotas(data["idToken"], false);
      getToleranceDate(data["idToken"]);
    });
  } else {
    getCuotas(token, false);
    getToleranceDate(token);
  }
});

/* Tolerance Date */

const getToleranceDate = (token) => {
  // Build auth sufix with token
  var authSufix = "auth=" + token;
  // Get todays turns.
  $.getJSON('https://il-tempo-dda8e.firebaseio.com/config/expireMargin.json?' + authSufix, function (data) {
    if (data == null) return;
    $('#tolerance_days').val(data.toString());
  });
};

const editToleranceDate = (token, days) => {
  // Build auth sufix with token
  var authSufix = "auth=" + token;
  $.ajax({
    url: 'https://il-tempo-dda8e.firebaseio.com/config.json?' + authSufix,
    type: "PATCH",
    data: '{"expireMargin":' + days + '}',
    success: function (data) {
      alert("Ahora hay una tolerancia de " + days + " días");
    },
    error: function (data) {
      alert("Lo sentimos, hubo un error.");
    }
  });
};


$('#change_tolerance_days').click(function () {
  var token = getCookie("token");
  var days = $('#tolerance_days').val();
  if (token == "") {
    var loginUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo";
    var response = $.post(loginUrl, {
      "email": "test@iltempo.com",
      "password": "contraseña123",
      "returnSecureToken": true,
    }, function (data, status, jqXHR) {
      token = data["idToken"];
      setCookie("token", token, data["expiresIn"]);
      editToleranceDate(token, days);
    });
  } else {
    editToleranceDate(token, days);
  }
});

/* Cuotas */

const getCuotas = (token, refresh) => {
  // Build auth sufix with token
  var authSufix = "auth=" + token;
  // Get todays turns.
  $.getJSON('https://il-tempo-dda8e.firebaseio.com/cuotas.json?' + authSufix, function (data) {
    if (data == null) return;
    var dataSet = [];
    dataArray = Object.values(data);
    idArray = Object.keys(data);
    for (var i = 0; i < dataArray.length; i++) {
      if (dateIsBefore(dataArray[i].fecha, $('#end_date').val()) && dateIsBefore($('#start_date').val(), dataArray[i].fecha)) {
        dataSet.push([idArray[i], dataArray[i].nombre, dataArray[i].dni, dataArray[i].fecha, dataArray[i].vence, dataArray[i].monto]);
      }
    }
    if (refresh) $('#all_cuotas').DataTable().destroy();
    $('#all_cuotas').DataTable({
      data: dataSet,
      columns: [
        { title: "ID" },
        { title: "Nombre" },
        { title: "Dni" },
        { title: "Fecha" },
        { title: "Vence" },
        { title: "Monto" }
      ]
    });
  });
}

const addCuota = async (token) => {
  var authSufix = "auth=" + token;
  var dni = $('#add_cuota_dni').val();
  var fecha = $('#add_cuota_fecha').val();
  var vence = $('#add_cuota_vence').val();
  var monto = $('#add_cuota_monto').val();
  var name = await getUserName(token, dni);
  var uid = await getUserId(token, dni);

  if (name == null || uid == null) {
    alert("Lo sentimos, ese DNI no está registrado");
    return;
  }
  if (!monto.length) {
    alert("Ingrese el monto porfavor");
    return;
  }
  $.ajax({
    url: 'https://il-tempo-dda8e.firebaseio.com/cuotas.json?' + authSufix,
    type: "POST",
    data: '{"vence":"' + vence + '", "dni": "' + dni + '", "fecha": "' + fecha + '", "nombre": "' + name + '", "monto": "' + monto + '"}',
    success: function (data) {
      $.ajax({
        url: 'https://il-tempo-dda8e.firebaseio.com/usuarios/' + uid + '.json?' + authSufix,
        type: "PATCH",
        data: '{"vencimiento":"' + vence + '"}',
        success: function (data) {
          alert("El pago ha sido creado correctamente");
        },
        error: function (data) {
          alert("Lo sentimos, hubo un error al crear el pago");
        }
      });
    },
    error: function (data) {
      alert("Lo sentimos, hubo un error al crear el pago");
    }
  });
};

const deleteCuota = (token, id) => {
  // Build auth sufix with token
  var authSufix = "auth=" + token;
  if (id.length == 0) {
    return;
  }
  $.ajax({
    url: 'https://il-tempo-dda8e.firebaseio.com/cuotas/' + id + '.json?' + authSufix,
    type: "GET",
    success: function (data) {
      if (data != null) {
        $.ajax({
          url: 'https://il-tempo-dda8e.firebaseio.com/cuotas/' + id + '.json?' + authSufix,
          type: "DELETE",
          success: function (data) {
            alert("El pago ha sido eliminado correctamente.");
          },
        });
      } else {
        alert("Lo sentimos el ID no existe.");
      }
    },
  });

}

const editPayment = (token, pid, date, expire, amount) => {
  // Build auth sufix with token
  var authSufix = "auth=" + token;
  var patchData = '{';
  if (date.length) patchData += '"fecha":"' + date + '",';
  if (amount.length) patchData += '"monto":"' + amount + '",';
  if (expire.length) patchData += '"vence":"' + expire + '",';
  // Remove the last comma
  if (patchData[patchData.length - 1] != "{") patchData = patchData.substr(0, patchData.length - 1);
  patchData += '}';
  $.ajax({
    url: 'https://il-tempo-dda8e.firebaseio.com/cuotas/' + pid + '.json?' + authSufix,
    type: "GET",
    success: function (data) {
      if (data != null) {
        console.log(data);
        var dni = data["dni"];
        $.ajax({
          url: 'https://il-tempo-dda8e.firebaseio.com/cuotas/' + pid + '.json?' + authSufix,
          type: "PATCH",
          data: patchData,
          success: function (data) {
            // If expire date is changed, change it in the user.
            if (expire.length) {
              editExpireInUser(token, dni, expire);
            } else {
              alert("El pago ha sido editado correctamente.");
            }
          }
        });
      } else {
        alert("Este Id no existe");
      }
    }
  });
}

const editExpireInUser = async (token, dni, expire) => {
  // Build auth sufix with token
  var authSufix = "auth=" + token;
  var uid = await getUserId(token, dni);
  console.log(uid);
  $.ajax({
    url: 'https://il-tempo-dda8e.firebaseio.com/usuarios/' + uid + '.json?' + authSufix,
    type: "PATCH",
    data: '{"vencimiento":"' + expire + '"}',
    success: function (data) {
      alert("El pago ha sido editado correctamente");
    }
  });

};

$('#delete_cuota_button').click(function () {
  var token = getCookie("token");
  var id = $('#delete_cuota_id').val();
  if (token == "") {
    var loginUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo";
    var response = $.post(loginUrl, {
      "email": "test@iltempo.com",
      "password": "contraseña123",
      "returnSecureToken": true,
    }, function (data, status, jqXHR) {
      token = data["idToken"];
      setCookie("token", token, data["expiresIn"]);
      deleteCuota(token, id);
    });
  } else {
    deleteCuota(token, id);
  }
});

$('#add_cuota_button').click(function () {
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
      addCuota(token);
    });
  } else {
    addCuota(token);
  }
});

$('#filter_cuotas').click(function () {
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
      getCuotas(token, true);
    });
  } else {
    getCuotas(token, true);
  }
});


$('#edit_cuota_button').click(async function () {
  var token = await getToken();
  var id = $('#edit_id').val();
  var date = $('#edit_date').val();
  var expire = $('#edit_expire').val();
  var amount = $('#edit_amount').val();
  if (!id.length) alert("Debe ingresar el Id del pago.");
  editPayment(token, id, date, expire, amount);
});