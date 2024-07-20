let description;
let githubId;

window.onload = async () => {
    await getToken("github");
    githubId = await getId();
    fetchData();
};

async function fetchData() {
    await getDescription();
}

async function getDescription() {
   fetch(`/get/description/${githubId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network error");
            }
            return response.json();
        })
        .then(data => {
            description = data.description;

            updateDescriptionElements();
        })
        .catch(console.error);
}

function updateDescriptionElements() {
    if (document.querySelector(".edit-description")) {
        (document.querySelector(".edit-description") as HTMLInputElement).value = description;
    }
    if (document.querySelector(".profile-desc")) {
        (document.querySelector(".profile-desc") as HTMLElement).textContent = description;
    }
}