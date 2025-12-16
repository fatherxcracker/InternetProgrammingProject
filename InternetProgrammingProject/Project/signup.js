$(document).ready(function () {
    const username = $('#username');
    const email = $('#email');
    const password = $('#password');
    const confirmPassword = $('#confirmPassword'); 
    const message = $('#message');

    function validateUsername(value) {
        const usernameRegex = /^[A-Za-z!$#@!%^&*]+$/;
        return usernameRegex.test(value);
    }

    function validateEmail(value) {
        return value.includes('@') && (value.endsWith('.com') || value.endsWith('.in'));
    }

    function validatePassword(value) {
        const passwordRegex = /^.{8,}$/;
        return passwordRegex.test(value);
    }

    $("#submitBtn").on('click', function () {
        const usernameVal = username.val().trim();
        const emailVal = email.val().trim();
        const passwordVal = password.val().trim();
        const confirmPasswordVal = confirmPassword.val().trim();

        message.text(''); 

        if (!validateUsername(usernameVal)) {
            message.text("Username can only contain letters and !$#@!%^&*").css('color', 'red').show();
            return;
        }

        if (!validateEmail(emailVal)) {
            message.text("Email must include @ and end with .com or .in").css('color', 'red').show();
            return;
        }

        if (!validatePassword(passwordVal)) {
            message.text("Password must be at least 8 characters").css('color', 'red').show();
            return;
        }

        if (passwordVal !== confirmPasswordVal) {
            message.text("Passwords do not match").css('color', 'red').show();
            return;
        }

        requestUsers(emailVal, passwordVal, message);
    });
});

function requestUsers(emailVal, passwordVal, message) {
    var urlUsers = "https://reqres.in/api/register";

    $.ajax({
        url: urlUsers,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            username: emailVal,
            email: emailVal,
            password: passwordVal
        }),
        headers: {
            "x-api-key": "reqres_8a9d49e625bf424f939781fa7506fdc6"
        },
        success: function (response) {
            message.text("Sign up successful! Redirecting to login...").css('color', 'green').show();

            setTimeout(function () {
                window.location.href = "login.html";
            }, 1750);
        },
        error: function () {
            message.text("Sign up failed. Please try again.").css('color', 'red').show();
        }
    });
}
