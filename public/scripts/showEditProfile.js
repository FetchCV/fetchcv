async function isLoggedIn() {
    let loggedIn = "no";
    await fetch("/is-logged-in")
        .then(response => {
        if (!response.ok) {
            throw new Error("Network error");
        }
        return response.json();
    })
        .then(data => {
        loggedIn = data.loggedIn;
    })
        .catch(error => {
        console.error(error);
    });
    return loggedIn;
}
async function checkUser() {
    let loggedIn = await isLoggedIn();
    if (loggedIn) {
        document.querySelector(".settings-toolbar")?.classList.remove("hidden");
    }
}
checkUser();
