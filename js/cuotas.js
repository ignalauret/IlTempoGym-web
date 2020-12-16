$(document).ready(function () {
  $('#start_date').val("15/12/2020");
  //$('#end_date').val(getToday());
  $('#end_date').val("18/12/2020");
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
    });
  } else {
    getCuotas(token, false);
  }
});

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
      if(dateIsBefore(dataArray[i].fecha, $('#end_date').val()) && dateIsBefore($('#start_date').val(), dataArray[i].fecha)){
        dataSet.push([idArray[i], dataArray[i].nombre, dataArray[i].dni, dataArray[i].fecha, dataArray[i].vence, dataArray[i].monto]);
      }
    }
    if(refresh) $('#all_cuotas').DataTable().destroy();
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

  if(name == null || uid ==  null) {
    alert("Lo sentimos, ese DNI no está registrado");
    return;
  }
  if(!monto.length) {
    alert("Ingrese el monto porfavor");
    return;
  }
  $.ajax({
    url: 'https://il-tempo-dda8e.firebaseio.com/cuotas.json?' + authSufix,
    type: "POST",
    data: '{"vence":"' + vence + '", "dni": "' + dni + '", "fecha": "' + fecha + '", "nombre": "' + name + '", "monto": "' + monto +'"}',
    success: function (data) {
      $.ajax({
        url: 'https://il-tempo-dda8e.firebaseio.com/usuarios/' + uid + '.json?' + authSufix,
        type: "PATCH",
        data: '{"vencimiento":"' + vence +'"}',
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
