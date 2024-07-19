let userData;
let totalStars = 0;
let languages = [];
async function loadPage() {
    await getToken("github");
    await getUserInfo();
    updateData();
    updateGithubStats();
    await getRepoData();
}
window.addEventListener("load", loadPage);
