const setCookie = (cname, cvalue, exseconds) => {
    var d = new Date();
    d.setTime(d.getTime() + (exseconds * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const getCookie = (cname) => {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
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

const getToday = () => {
    const date_today = new Date();
    var day_today = date_today.getDate();
    var month_today = date_today.getMonth() + 1;
    var year_today = date_today.getFullYear();
    var today = day_today.toString() + "/" + month_today.toString() + "/" + year_today.toString();
    return today;
}

const getFirstDayOfMonth = () => {
    const date_today = new Date();
    var month_today = date_today.getMonth() + 1;
    var year_today = date_today.getFullYear();
    var first_day = "1/" + month_today.toString() + "/" + year_today.toString();
    return first_day;

}

const dateIsBefore = (date1, date2) => {
    const arr1 = date1.split("/");
    const arr2 = date2.split("/");
    if (parseInt(arr1[2]) < parseInt(arr2[2])) return true;
    if (parseInt(arr1[2]) > parseInt(arr2[2])) return false;
    if (parseInt(arr1[1]) < parseInt(arr2[1])) return true;
    if (parseInt(arr1[1]) > parseInt(arr2[1])) return false;
    if (parseInt(arr1[0]) <= parseInt(arr2[0])) return true;
    return false;
}


const getUserName = async (token, dni) => {
    if (!dni.length) return;
    // Build auth sufix with token
    var authSufix = "auth=" + token;
    var name;
    await $.getJSON('https://il-tempo-dda8e.firebaseio.com/usuarios.json?orderBy="dni"&equalTo="' + dni + '"&' + authSufix, function (data) {
        if (data == null) return;
        var values = Object.values(data);
        if (!values.length) return;
        name = values[0].nombre;
        return;
    });
    console.log(name);
    return name;
};

const getUserId = async (token, dni) => {
    if (!dni.length) return;
    // Build auth sufix with token
    var authSufix = "auth=" + token;
    var id;
    await $.getJSON('https://il-tempo-dda8e.firebaseio.com/usuarios.json?orderBy="dni"&equalTo="' + dni + '"&' + authSufix, function (data) {
        if (data == null) return;
        var values = Object.keys(data);
        if (!values.length) return;
        id = values[0];
        return;
    });
    console.log(id);
    return id;
};