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