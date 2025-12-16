$(document).ready(function() {
    $('#button').click(function() {
        const email = $('#email').val().trim();
        const password = $('#password').val().trim();
        const error = $('#message');

        error.hide();

        if (!email) {
            error.text("Please enter your username.").show();
            return;
        }
        if (!email || password.length < 8) {
            error.text("Password must be at least 8 characters.").show();
            return;
        }

        requestUsers(email,password,error);
    });
});

function requestUsers(email, password, error){
    var urlUsers = "https://reqres.in/api/login";
    $.ajax({
        method: "POST",
        url: urlUsers,
        contentType: "application/json",
        accept: 'application/json',
        data: JSON.stringify({
            email: email,
            password: password
        }),
        headers: {
            "x-api-key": "reqres_8a9d49e625bf424f939781fa7506fdc6"
        }
    })
    .done(function(res){
        const email = $('#email').val().trim();
        const username = email.split('@')[0]; 

        setCookie("token", res.token, 0.125); 
        setCookie("email", email, 7);        
        setCookie("username", username, 7);   

        window.location.href = "HomePage.html";
    })
    .fail(function () {
        error.text("Invalid username or password.").show();
    });
}

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}
