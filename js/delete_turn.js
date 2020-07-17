const deleteTurn = (token, id) => {
  // Build auth sufix with token
  var authSufix = "auth=" + token;
  $.ajax({
    url: 'https://il-tempo-dda8e.firebaseio.com/turnos/'+ id +'.json?'+ authSufix,
    type: "DELETE",
  });
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

$('#delete_button').click(function() {
  var token = getCookie("token");
  var id = $('#delete_id').val();
  if(token == "") {
    var loginUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo";
    var response = $.post(loginUrl, {
              "email": "test@iltempo.com",
              "password": "contraseña123",
              "returnSecureToken": true,
            },function(data, status, jqXHR) {
              token = data["idToken"];
              setCookie("token", token, data["expiresIn"]);
              deleteTurn(token, id);
            });
  } else {
    deleteTurn(token, id);
  }
});
