function toggleEditMode() {
    let editPanel = document.querySelector(".edit-controls");
    if (editPanel?.classList.contains("hidden")) {
        editPanel?.classList.remove("hidden");
        prepareEditMode();
    }
    else {
        editPanel?.classList.add("hidden");
    }
}

function prepareEditMode() {
    // @ts-ignore
    document.querySelector(".edit-description").value = userData.bio;
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
        .then(data => console.log("Success:", data))
        .catch(error => console.error("Error:", error));
}