async function updateAndGetStats(githubId) {
    fetch(`/get/stats/${githubId}`)
        .then(response => {
        if (!response.ok) {
            throw new Error("Network error");
        }
        return response.json();
    })
        .then(data => {
        updateStatsElement(data);
    })
        .catch(console.error);
}
function updateStatsElement(data) {
    let statsElement = document.querySelector(".visitors-views");
    if (statsElement)
        statsElement.textContent = `${data.visitors} visitors | ${data.visits} views`;
}
