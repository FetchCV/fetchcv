let userData; // global variable
let username = "";
let totalStars = 0;
let languages = [];
let TOKEN;
let tokenRecieved = false;
let header;
getToken("github");
async function getToken(service) {
    console.log('Fetching token...');
    const response = await fetch(`/token/${service}`);
    if (response.ok) {
        const token = await response.text();
        tokenRecieved = true;
        console.log("Token received.");
        TOKEN = token;
        header = {
            'headers': {
                'Authorization': `token ${TOKEN}`
            }
        };
    }
    else {
        showError("Token Error", "Failed to fetch token. Try reloading the page.", "bg-red-800");
        console.error('Error fetching token:', response.statusText);
    }
}
async function getUserInfo() {
    if (!tokenRecieved) {
        console.log('Waiting for token to be received...');
        setTimeout(getUserInfo, 200);
        return;
    }
    try {
        const response = await fetch(`https://api.github.com/users/${username}`, header);
        if (response.ok) {
            userData = await response.json();
            updateData();
            updateGithubStats();
            await getRepoData();
        }
        else if (response.status === 404) {
            showError("Oh no!", "User does not exist. Try another username.", "bg-red-800");
        }
        else {
            showError("Connection Error", "Failed to fetch user data. Try reloading the page.", "bg-red-800");
            console.error("Failed to fetch user data. Status:", response.status, response);
        }
    }
    catch (error) {
        console.log(error);
    }
}
async function getRepoData() {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`, header);
        const repos = await response.json();
        getRepoStars(repos);
        getRepoLangs(repos);
    }
    catch (error) {
        showError("Oh no!", "Could not get user repository data.", "bg-red-800");
        console.error('Error fetching data:', error);
    }
}
function updateData() {
    document.querySelector(".user-info").classList.remove("hidden");
    document.querySelector(".profile-picture").src = userData.avatar_url;
    document.querySelector(".profile-name").textContent = userData.name;
    document.querySelector(".profile-handle").textContent = userData.login;
    document.querySelector(".profile-desc").textContent = userData.bio;
    document.querySelector(".profile-repos").textContent = userData.public_repos;
    document.querySelector(".profile-followers").textContent = userData.followers;
    document.querySelector(".profile-following").textContent = userData.following;
    document.querySelector(".profile-location").textContent = userData.location;
    document.querySelector(".profile-email").textContent = userData.email;
    document.querySelector(".profile-website").textContent = "Personal Website";
    document.querySelector(".profile-github").textContent = "Github Profile";
    document.querySelector(".profile-website").href = userData.blog;
    document.querySelector(".profile-github").href = userData.html_url;
}
async function getRepoStars(repos) {
    for (const repo of repos) {
        const repoResponse = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}`, header);
        const repoData = await repoResponse.json();
        totalStars += repoData.stargazers_count;
    }
    document.querySelector(".profile-stars").textContent = totalStars.toString();
    return totalStars;
}
async function getRepoLangs(repos) {
    let langs = {};
    languages = [];
    for (const repo of repos) {
        const repoResponse = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/languages`, header);
        const repoData = await repoResponse.json();
        for (const lang in repoData) {
            if (langs.hasOwnProperty(lang)) {
                langs[lang] += repoData[lang];
            }
            else {
                langs[lang] = repoData[lang];
            }
        }
    }
    let sortedLangs = [];
    for (let lang in langs) {
        languages.push([lang, langs[lang]]);
    }
    languages.sort(function (a, b) {
        return b[1] - a[1];
    });
    const total = languages.reduce((acc, curr) => acc + curr[1], 0);
    const percentLanguages = languages.map(lang => [lang[0], Math.round((lang[1] / total) * 100)]);
    generateLanguageElements(percentLanguages);
    return languages;
}
function generateLanguageElements(languages) {
    const langList = document.querySelector(".profile-langs");
    if (langList) {
        langList.innerHTML = "";
        for (const lang of languages) {
            const langElement = document.createElement("li");
            langElement.textContent = `${lang[0]}: ${lang[1]}%`;
            langElement.classList.add("inline-block", "bg-zinc-700", "px-2", "m-1", "py-1", "rounded-lg", "border-[1px]", "border-zinc-700", "border-t-zinc-600");
            langList.appendChild(langElement);
        }
    }
}
function updateGithubStats() {
    console.log(`Username: ${username}`);
    const githubStatsElement = document.querySelector(".github-stats");
    if (githubStatsElement) {
        githubStatsElement.innerHTML = `<picture>
         <source
            srcset="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=slateorange"
            media="(prefers-color-scheme: dark)"
         />
         <source
            srcset="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true"
            media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)"
         />
         <img src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true" />
      </picture>`;
    }
}
async function getRateLimit() {
    const response = await fetch('https://api.github.com/rate_limit', header);
    if (response.ok) {
        const data = await response.json();
    }
    else {
        console.error('Error fetching rate limit:', response.statusText);
    }
}