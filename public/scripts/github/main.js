let userData;
let totalStars = 0;
let languages = [];
async function loadPage() {
    await getToken("github");
    await getUserInfo();
    if (typeof hasAccount != "undefined")
        await getDescription(userData.id);
    updateData();
    updateGithubStats();
    await getRepoData();
}
window.addEventListener("load", loadPage);
