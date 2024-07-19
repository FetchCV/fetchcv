// @ts-nocheck
//===============================================
// Setting username
//===============================================
function newUsername() {
    hideError();
    let usernameElement = document.getElementById("username");
    if (usernameElement) {
        // @ts-ignore
        username = usernameElement.value;
        // @ts-ignore
        window.location.href = window.location.origin + "/user/github/" + username;
    }
}
const usernameInput = document.getElementById("username");
if (usernameInput) {
    usernameInput.addEventListener("keydown", function (event) {
        if (event.key == "Enter") {
            newUsername();
        }
    });
}
