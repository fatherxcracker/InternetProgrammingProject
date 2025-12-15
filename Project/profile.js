$(document).ready(function () {

    const username = getCookie("username");
    const email = getCookie("email");
    
    $("#username").val(username);
    $("#email").val(email);
    
    $("#imageInput").change(function () {
        const file = this.files[0];
        if (file) {
            $("#profileImg").attr("src", URL.createObjectURL(file));
        }
    });
    
    function validateEmail(email) {
        return email.includes('@') && (email.endsWith('.com') || email.endsWith('.in'));
    }
    
    $("#editBtn").click(function () {
        $("#username, #email").prop("readonly", false);
        $("#saveBtn").prop("disabled", false);
        $("#saveMessage").text("");
    });
    
    $("#saveBtn").click(function () {
        const newUsername = $("#username").val().trim();
        const newEmail = $("#email").val().trim();
        
        if (!validateEmail(newEmail)) {
            $("#saveMessage").text("Invalid email format. Must include @ and end with .com or .in").css("color", "red");
            return;
        }
        
        document.cookie = "username=" + newUsername + "; path=/";
        document.cookie = "email=" + newEmail + "; path=/";
        
        $("#username, #email").prop("readonly", true);
        $(this).prop("disabled", true);
        
        $("#saveMessage").text("Changes have been saved successfully!").css("color", "green");
    });
    
});

function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) {
        return parts.pop().split(";").shift();
    }
    return "not found";
}