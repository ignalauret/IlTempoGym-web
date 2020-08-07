const addClient = (token, name, dni) => {
  // Build auth sufix with token
  var authSufix = "auth=" + token;
  var firstName = name.split(" ")[0];
  console.log(dni);
  console.log(firstName);
  $.ajax({
    url: "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo",
    type: "POST",
    headers: {'Content-Type': 'application/json',},
    data: '{"email":"' + dni + "@iltempo.com" + '","password":"' + firstName + '","returnSecureToken": true}',
    success: function(data) {
      if(data != null) {
        var uid = data["localId"];
        var patchData = '{"dni":"' + dni + '","nombre":"' + name + '"}';
        // Musculación
        $.ajax({
          url: 'https://il-tempo-dda8e.firebaseio.com/usuarios/' + uid + '.json?'+ authSufix,
          type: "PATCH",
          data: patchData,
        });
      }
    },
    error: function(xhr, status, error) {
      console.log(eval("(" + xhr.responseText + ")"));
    }
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

$('#add_button').click(function() {
  var token = getCookie("token");
  var name = $('#add_name').val();
  var dni = $('#add_dni').val();
  if(token == "") {
    var loginUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo";
    var response = $.post(loginUrl, {
              "email": "test@iltempo.com",
              "password": "contraseña123",
              "returnSecureToken": true,
            },function(data, status, jqXHR) {
              token = data["idToken"];
              setCookie("token", token, data["expiresIn"]);
              addClient(token, name, dni);
            });
  } else {
    addClient(token, id);
  }
});
