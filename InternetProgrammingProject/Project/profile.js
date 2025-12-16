$(document).ready(function () {
    const username = getCookie("username");
    const email = getCookie("email");
    const profileImg = getCookie("profileImg"); 

    if (!username || !email) {
        alert("You must be logged in to view this page.");
        window.location.href = "login.html";
        return;
    }

    $("#username").val(username);
    $("#email").val(email);

    if (profileImg) {
        $("#profileImg").attr("src", profileImg);
    }

    $("#imageInput").change(function () {
        const file = this.files[0];
        if (file) {
            const imgURL = URL.createObjectURL(file);
            $("#profileImg").attr("src", imgURL);
            setCookie("profileImg", imgURL, 7); 
        }
    });

    $("#editBtn").click(function () {
        $("#username, #email").prop("readonly", false);
        $("#saveBtn").prop("disabled", false);
        $("#saveMessage").text("");
    });

    $("#saveBtn").click(function () {
        const newUsername = $("#username").val().trim();
        const newEmail = $("#email").val().trim();

        if (!validateEmail(newEmail)) {
            $("#saveMessage").text("Invalid email format.").css("color", "red");
            return;
        }

        setCookie("username", newUsername, 7);
        setCookie("email", newEmail, 7);

        $("#username, #email").prop("readonly", true);
        $(this).prop("disabled", true);
        $("#saveMessage").text("Changes saved successfully!").css("color", "green");
    });

    $('#logoutBtn').click(function () {
    setCookie('username', '', -1);
    setCookie('email', '', -1);
    setCookie('token', '', -1);

    window.location.href = 'login.html';
});
});

function validateEmail(email) {
    return email.includes("@") && (email.endsWith(".com") || email.endsWith(".in"));
}

function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
    return "";
}

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days*24*60*60*1000);
    document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + d.toUTCString() + ";path=/";
}

