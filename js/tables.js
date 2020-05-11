$(document).ready(function() {
  var date = new Date();
  var day_today = date.getDate();
  var month_today = date.getMonth() + 1;
  var today = day_today.toString() + "/" + month_today.toString();
  var month_tomorrow = month_today;
  var day_tomorrow = day_today + 1;
  if(day_tomorrow == 32) {
    day_tomorrow = 1;
    month_tomorrow++;
  }
  var tomorrow = day_tomorrow.toString() + "/" + month_tomorrow.toString();

  var authSufix = "";
  var loginUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDMsEID7PGSNpM5EySROO3iA-eUhcO_KPo";
  var response = $.post(loginUrl, {
            "email": "ignalau@iltempo.com",
            "password": "contraseña123",
            "returnSecureToken": true,
          },function(data, status, jqXHR) {
            authSufix = "auth=" + data["idToken"];
            // Musculación
            $.getJSON('https://il-tempo-dda8e.firebaseio.com/musculacion.json?orderBy="fecha"&equalTo="' + today + '"&' + authSufix, function(data) {
              if(data == null) return;
              var dataSet = [];
              dataArray = Object.values(data);
              for(var turno of dataArray) {
                dataSet.push([turno.nombre, turno.dni, turno.clase, turno.dia, turno.hora, turno.fecha]);
              }

              $('#musculacion_today').DataTable( {
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


            $.getJSON('https://il-tempo-dda8e.firebaseio.com/musculacion.json?' + authSufix, function(data) {
              if(data == null) return;
              var dataSet = [];
              dataArray = Object.values(data);
              for(var turno of dataArray) {
                dataSet.push([turno.nombre, turno.dni, turno.clase, turno.dia, turno.hora, turno.fecha]);
              }

              $('#musculacion_tomorrow').DataTable( {
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

            // Spinning

            $.getJSON('https://il-tempo-dda8e.firebaseio.com/spinning.json?orderBy="fecha"&equalTo="' + today + '"&' + authSufix, function(data) {
              if(data == null) return;
              var dataSet = [];
              dataArray = Object.values(data);
              for(var turno of dataArray) {
                dataSet.push([turno.nombre, turno.dni, turno.clase, turno.dia, turno.hora, turno.fecha]);
              }

              $('#spinning_today').DataTable( {
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

            $.getJSON('https://il-tempo-dda8e.firebaseio.com/spinning.json?' + authSufix, function(data) {
              if(data == null) return;
              var dataSet = [];
              dataArray = Object.values(data);
              for(var turno of dataArray) {
                dataSet.push([turno.nombre, turno.dni, turno.clase, turno.dia, turno.hora, turno.fecha]);
              }

              $('#spinning_tomorrow').DataTable( {
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

            //Zumba

            $.getJSON('https://il-tempo-dda8e.firebaseio.com/zumba.json?orderBy="fecha"&equalTo="' + today + '"&' + authSufix, function(data) {
              if(data == null) return;
              var dataSet = [];
              dataArray = Object.values(data);
              for(var turno of dataArray) {
                dataSet.push([turno.nombre, turno.dni, turno.clase, turno.dia, turno.hora, turno.fecha]);
              }

              $('#zumba_today').DataTable( {
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

            $.getJSON('https://il-tempo-dda8e.firebaseio.com/zumba.json?' + authSufix, function(data) {
              if(data == null) return;
              var dataSet = [];
              dataArray = Object.values(data);
              for(var turno of dataArray) {
                dataSet.push([turno.nombre, turno.dni, turno.clase, turno.dia, turno.hora, turno.fecha]);
              }

              $('#zumba_tomorrow').DataTable( {
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
          }
        );


} );
