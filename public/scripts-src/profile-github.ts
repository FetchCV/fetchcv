interface UserData {
    avatar_url: string,
    name: string,
    login: string,
    bio: string,
    public_repos: number,
    followers: number,
    following: number,
    location: string,
    email: string,
    blog: string,
    html_url: string
 
 }
 
 let userData: UserData; // global variable
 let username: string = "";
 let totalStars: number = 0;
 let languages: [string, number][] = [];
 let TOKEN: string;
 let tokenRecieved: boolean = false;
 let header: RequestInit | undefined = {};
 
 getToken("github");
 
 async function getToken(service: string) {
    console.log("Fetching token...");
    const response = await fetch(`/token/${service}`);
    if (response.ok) {
       const token = await response.text() as string;
       tokenRecieved = true;
       console.log("Token received.");
       TOKEN = token;
       header = {
          'headers': {
             'Authorization': `token ${TOKEN}`
          }
       }
    } else {
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
       console.log(header);
       const response = await fetch(`https://api.github.com/users/${username}`, header);
       if (response.ok) {
          userData = await response.json();
          updateData();
          updateGithubStats();
          await getRepoData();
       } else if (response.status === 404) {
          showError("Oh no!", "User does not exist. Try another username.", "bg-red-800");
       } else {
          showError("Connection Error", "Failed to fetch user data. Try reloading the page.", "bg-red-800");
          console.error("Failed to fetch user data. Status:", response.status, response);
       }
    }
    catch (error) {
       showError("Connection Error", "Could not request user data.", "bg-red-800");
       console.error("Failed to request user data. Error - ", error);
    }
 }
 
 async function getRepoData() {
    try {
       const response = await fetch(`https://api.github.com/users/${username}/repos`, header);
       const repos = await response.json();
 
       getRepoStars(repos);
       getRepoLangs(repos);
    } catch (error) {
       showError("Oh no!", "Could not get user repository data.", "bg-red-800");
       console.error('Error fetching data:', error);
    }
 }
 
 function updateData() {
    if (!userData) {
       showError("Oh no!", "Could get the user data, my bad", "bg-red-800");
       return;
    }
    (document.querySelector(".user-info") as HTMLElement).classList.remove("hidden");
    (document.querySelector(".profile-picture") as HTMLImageElement).src = userData.avatar_url;
    (document.querySelector(".profile-name") as HTMLElement).textContent = userData.name;
    (document.querySelector(".profile-handle") as HTMLElement).textContent = userData.login;
    (document.querySelector(".profile-desc") as HTMLElement).textContent = userData.bio;
 
    (document.querySelector(".profile-repos") as HTMLElement).textContent = userData.public_repos.toString();
 
    (document.querySelector(".profile-followers") as HTMLElement).textContent = userData.followers.toString();
    (document.querySelector(".profile-following") as HTMLElement).textContent = userData.following.toString();
 
 
    (document.querySelector(".profile-location") as HTMLElement).textContent = userData.location;
    (document.querySelector(".profile-email") as HTMLElement).textContent = userData.email;
    (document.querySelector(".profile-website") as HTMLAnchorElement).textContent = "Personal Website";
    (document.querySelector(".profile-github") as HTMLAnchorElement).textContent = "Github Profile";
    (document.querySelector(".profile-website") as HTMLAnchorElement).href = userData.blog;
    (document.querySelector(".profile-github") as HTMLAnchorElement).href = userData.html_url;
 }
 
 async function getRepoStars(repos: any[]) {
    for (const repo of repos) {
       const repoResponse = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}`, header);
       const repoData = await repoResponse.json();
       totalStars += repoData.stargazers_count;
    }
 
    (document.querySelector(".profile-stars") as HTMLElement).textContent = totalStars.toString();
    return totalStars;
 }
 
 async function getRepoLangs(repos: any[]) {
    let langs: { [key: string]: number } = {};
    languages = [];
 
    for (const repo of repos) {
       const repoResponse = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/languages`, header);
       const repoData = await repoResponse.json();
 
       for (const lang in repoData) {
          if (langs.hasOwnProperty(lang)) {
             langs[lang] += repoData[lang];
          } else {
             langs[lang] = repoData[lang];
          }
       }
    }
 
    let sortedLangs: [string, number][] = [];
    for (let lang in langs) {
       languages.push([lang, langs[lang]] as [string, number]);
    }
 
    languages.sort(function (a, b) {
       return b[1] - a[1];
    });
 
    const total = languages.reduce((acc, curr) => acc + curr[1], 0);
    const percentLanguages: [string, number][] = languages.map(lang => [lang[0], Math.round((lang[1] / total) * 100)]);
 
    generateLanguageElements(percentLanguages);
 
    return languages;
 }
 
 function generateLanguageElements(languages: [string, number][]) {
    const langList = document.querySelector(".profile-langs");
    if (langList) {
       langList.innerHTML = "";
       for (const lang of languages) {
          const langElement = document.createElement("li");
          langElement.textContent = `${lang[0]}: ${lang[1]}%`;
          langElement.classList.add("inline-block", "bg-zinc-200", "dark:bg-zinc-700", "px-2", "m-1", "py-1", "rounded-lg", "border-[1px]", "border-zinc-400", "dark:border-zinc-700", "border-t-zinc-300", "dark:border-t-zinc-600", "inline-flex", "items-center");
          langElement.innerHTML = ` <i class="devicon-${getLangIcon(lang[0])}-plain mr-1.5"></i>` + langElement.textContent;
          langList.appendChild(langElement);
       }
    }
    function getLangIcon(lang: string) {
       switch (lang) {
          case "JavaScript":
             return "javascript";
          case "TypeScript":
             return "typescript";
          case "EJS":
          case "HTML":
             return "html5";
          case "CSS":
             return "css3";
          case "Python":
             return "python";
          case "Java":
             return "java";
          case "C":
             return "c";
          case "C++":
             return "cplusplus";
          case "Lua":
             return "lua";
          case "Shell":
             return "bash";
          case "Ruby":
             return "ruby";
          case "PHP":
             return "php";
          case "Swift":
             return "swift";
          case "Go":
             return "go";
          case "Rust":
             return "rust";
          case "Kotlin":
             return "kotlin";
          case "GDScript":
             return "godot";
         case "QML":
            return "Qt";
          default:
             return "gimp hidden";
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
    if (header) {
       const response = await fetch('https://api.github.com/rate_limit', header);
 
       if (response.ok) {
          const data = await response.json();
       } else {
          console.error('Error fetching rate limit:', response.statusText);
       }
    }
 }
