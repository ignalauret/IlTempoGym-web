const deleteTurn = (token, id) => {
  // Build auth sufix with token
  var authSufix = "auth=" + token;
  if (id == "") {
    return;
  }
  $.ajax({
    url: 'https://il-tempo-dda8e.firebaseio.com/turnos/' + id + '.json?' + authSufix,
    type: "GET",
    success: function (data) {
      if (data != null) {
        $.ajax({
          url: 'https://il-tempo-dda8e.firebaseio.com/turnos/' + id + '.json?' + authSufix,
          type: "DELETE",
          success: function (data) {
            alert("El turno ha sido eliminado correctamente.");
          },
        });
      } else {
        alert("Lo sentimos el ID no existe.");
      }
    },
  });

}

$('#delete_button').click(function () {
  var token = getCookie("token");
  var id = $('#delete_id').val();
  if (token == "") {
    var loginUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo";
    var response = $.post(loginUrl, {
      "email": "test@iltempo.com",
      "password": "contraseña123",
      "returnSecureToken": true,
    }, function (data, status, jqXHR) {
      token = data["idToken"];
      setCookie("token", token, data["expiresIn"]);
      deleteTurn(token, id);
    });
  } else {
    deleteTurn(token, id);
  }
});
