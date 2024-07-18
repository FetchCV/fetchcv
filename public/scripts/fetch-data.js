let description;
window.onload = fetchData;
function fetchData() {
    getDescription();
}
function getDescription() {
    fetch("/get/description")
        .then(response => {
        if (!response.ok) {
            throw new Error("Network error");
        }
        return response.json();
    })
        .then(data => {
        description = data.description;
    })
        .catch(console.error);
}
