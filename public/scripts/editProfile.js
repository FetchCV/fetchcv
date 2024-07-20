function showChangesBanner() {
    let banner = document.querySelector(".changes-saved-banner");
    toggleVisibility(banner);
    setTimeout(() => {
        toggleVisibility(banner);
    }, 5000);
}
function prepareEditMode() {
    // @ts-ignore
    document.querySelector(".edit-description").value = description || userData.bio;
}
function editDescription(newText) {
    fetch("/edit/description", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            description: newText
        })
    }).then(response => response.json())
        .then(() => {
        description = newText;
        showChangesBanner();
        updateDescription();
    })
        .catch(error => console.error("Error:", error));
}
function revertDescriptionToGitHubBio() {
    editDescription(userData.bio);
    // @ts-ignore
    document.querySelector("#edit-description").value = userData.bio;
}
function toggleVisibility(element) {
    if (element.classList.contains("hidden")) {
        element.classList.remove("hidden");
    }
    else {
        element.classList.add("hidden");
    }
}
