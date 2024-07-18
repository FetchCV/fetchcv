// @ts-nocheck

function updateData() {
   if (!userData) {
      showError("Oh no!", "Could not get the user data, my bad", "bg-red-800");
      return;
   }
   (document.querySelector(".user-info") as HTMLElement).classList.remove("hidden");
   (document.querySelector(".profile-picture") as HTMLImageElement).src = userData.avatar_url;
   (document.querySelector(".profile-name") as HTMLElement).textContent = userData.name;
   (document.querySelector(".profile-handle") as HTMLElement).textContent = userData.login;
   updateDescription();

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

function updateDescription() {
   console.log(description);
   (document.querySelector(".profile-desc") as HTMLElement).textContent = description || userData.bio;
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
