let description;
window.onload = fetchData;
async function fetchData() {
    console.log("Fetching data...");
    await getDescription();
}
async function getDescription() {
    console.log("Fetching description...");
    let githubId = await getId();
    fetch(`/get/description/${githubId}`)
        .then(response => {
        if (!response.ok) {
            throw new Error("Network error");
        }
        return response.json();
    })
        .then(data => {
        console.log("Data fetched:", data);
        description = data.description;
        updateDescriptionElements();
    })
        .catch(console.error);
}
function updateDescriptionElements() {
    console.log("Updating description elements...");
    if (document.querySelector(".edit-description")) {
        document.querySelector(".edit-description").value = description;
    }
    if (document.querySelector(".profile-description")) {
        document.querySelector(".profile-description").textContent = description;
    }
}
