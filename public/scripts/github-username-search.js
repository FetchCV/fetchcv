//===============================================
// Username search
//===============================================
function newUsername() {
    let usernameElement = document.getElementById("username");
    if (usernameElement) {
        username = usernameElement.value;
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
