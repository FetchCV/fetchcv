//===============================================
// On load
//===============================================
// First check for username
window.addEventListener("load", () => {
    getUserInfo();
});
//===============================================
// Setting username
//===============================================
function newUsername() {
    hideError();
    let usernameElement = document.getElementById("username");
    if (usernameElement) {
        username = usernameElement.value;
        window.location.href = window.location.origin + "/user/github/" + username;
        getUserInfo();
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
