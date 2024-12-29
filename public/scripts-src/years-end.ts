interface StatsData {
   daysActive: number;
   issuesOpened: number;
   issuesClosed: number;
   prOpened: number;
   reposContributedTo: number;
   stars: number;
   commits: number;
   userName: string;
   userProfilePicture: string;
   description: string;
   followers: number;
   following: number;
   repos: number;
   topLanguages: string[];
   topRepos: any[];
}

let statsData: StatsData = {
   daysActive: -1,
   issuesOpened: -1,
   issuesClosed: -1,
   prOpened: -1,
   reposContributedTo: -1,
   stars: -1,
   commits: -1,
   userName: "",
   userProfilePicture: "",
   description: "",
   followers: -1,
   following: -1,
   repos: -1,
   topLanguages: [],
   topRepos: []
};

let dataReady: { [key: string]: boolean } = {
   general: true,
   stars: true,
   languages: true,
   yearlyStats: false
};

async function fetchUserData(username: string): Promise<void> {
   try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      statsData.userName = data.login;
      statsData.userProfilePicture = data.avatar_url;
      statsData.description = data.bio;
      statsData.followers = data.followers;
      statsData.following = data.following;
      statsData.repos = data.public_repos;
      updateCurrentData('general');
   } catch (error) {
      console.error('Failed to fetch user data:', error);
   }
}

async function fetchRepoData(username: string): Promise<void> {
   try {
      const response = await fetch(`https://api.github.com/users/${username}/repos`);
      if (!response.ok) throw new Error('Network response was not ok');
      const repos = await response.json();
      statsData.reposContributedTo = repos.length;
      statsData.stars = repos.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0);
      statsData.topRepos = repos.sort((a: any, b: any) => b.stargazers_count - a.stargazers_count).slice(0, 3);
      updateCurrentData('stars');
   } catch (error) {
      console.error('Failed to fetch repo data:', error);
   }
}

async function fetchLanguagesData(username: string): Promise<void> {
   try {
      const response = await fetch(`https://api.github.com/users/${username}/repos`, header);
      if (!response.ok) throw new Error('Network response was not ok');
      const repos = await response.json();
      const languages: { [key: string]: number } = {};
      for (const repo of repos) {
         const langResponse = await fetch(repo.languages_url);
         if (!langResponse.ok) throw new Error('Network response was not ok');
         const repoLangs = await langResponse.json();
         for (const [lang, count] of Object.entries(repoLangs)) {
            languages[lang] = (languages[lang] || 0) + (count as number);
         }
      }
      statsData.topLanguages = Object.entries(languages).sort((a, b) => b[1] - a[1]).map(([lang]) => lang).slice(0, 3);
      updateCurrentData('languages');
   } catch (error) {
      console.error('Failed to fetch languages data:', error);
   }
}
async function fetchYearlyStats(username: string, year: number): Promise<void> {
   try {
      let page = 1;
      const events: any[] = [];
      let fetchedEvents: any[];

      // Fetch events while there are more pages
      do {
         const eventsResponse = await fetch(`https://api.github.com/users/${username}/events?page=${page}&per_page=100`);
         
         if (!eventsResponse.ok) {
            throw new Error(`Network response was not ok for page ${page}`);
         }
         
         fetchedEvents = await eventsResponse.json();
         events.push(...fetchedEvents);
         page++;
      } while (fetchedEvents.length > 0);

      // Define start and end dates for the given year
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year + 1}-01-01`); // Use Jan 1st of the next year for better boundary handling.

      // Filter events to those within the specified year
      const yearlyEvents = events.filter((event: any) => {
         const eventDate = new Date(event.created_at);
         return eventDate >= startDate && eventDate < endDate; // Ensure it doesn't include events from the next year
      });

      // Days active calculation (distinct days with events)
      statsData.daysActive = new Set(yearlyEvents.map((event: any) => new Date(event.created_at).toDateString())).size;

      // Issues opened and closed
      statsData.issuesOpened = yearlyEvents.filter((event: any) => event.type === 'IssuesEvent' && event.payload.action === 'opened').length;
      statsData.issuesClosed = yearlyEvents.filter((event: any) => event.type === 'IssuesEvent' && event.payload.action === 'closed').length;

      // Pull requests opened
      statsData.prOpened = yearlyEvents.filter((event: any) => event.type === 'PullRequestEvent' && event.payload.action === 'opened').length;

      // Commits calculation: Summing the number of commits in push events
      statsData.commits = yearlyEvents.filter((event: any) => event.type === 'PushEvent')
         .reduce((acc: number, event: any) => acc + (event.payload.size || 0), 0); // Ensure to check payload.size exists

      console.log('Yearly Stats:', statsData); // Optional: Log data for debugging

      // Update the stats in your app (assumed this function exists)
      updateCurrentData('yearlyStats');
      
   } catch (error) {
      console.error('Failed to fetch yearly stats:', error);
   }
}


async function getStatsData(username: string): Promise<void> {
   await Promise.all([
      // fetchUserData(username),
      // fetchRepoData(username),
      // fetchLanguagesData(username),
      fetchYearlyStats(username, 2024)
   ]);
}

function updateCurrentData(which: string): void {
   dataReady[which] = true;
   checkIfReady();
}

function populatePageWithData(): void {
   document.querySelector(".active-days")!.textContent = statsData.daysActive.toString();
   document.querySelector(".issues-opened-closed")!.textContent = `${statsData.issuesOpened} issues opened, ${statsData.issuesClosed} closed`;
   document.querySelector(".pr-created")!.textContent = `${statsData.prOpened} prs`;
   document.querySelector(".repos-contributed-to")!.textContent = `contributed to ${statsData.reposContributedTo} repos`;
   // document.querySelector(".profile-picture img")!.src = statsData.userProfilePicture;
   document.querySelector(".user-name")!.textContent = statsData.userName;
   document.querySelector(".user-description")!.textContent = statsData.description;
   document.querySelector(".followers-following")!.textContent = `${statsData.followers} followers - ${statsData.following} following`;
   document.querySelector(".repos-stars")!.textContent = `${statsData.repos} repos - ${statsData.stars} stars`;
   document.querySelector(".top-languages")!.innerHTML = statsData.topLanguages.map(lang => `<p>${lang}</p>`).join('');
   document.querySelector(".stars-this-year")!.textContent = `earned ${statsData.stars} stars`;
   document.querySelector(".commits-this-year")!.textContent = `made ${statsData.commits} commits`;
   document.querySelector(".top-repos")!.innerHTML = statsData.topRepos.map(repo => `<p>${repo.name} (${repo.stargazers_count} stars)</p>`).join('');
}

function checkIfReady(): void {
   if (dataReady.general && dataReady.stars && dataReady.languages) {
      console.log("done");
      loading.remove();
      document.querySelector(".content")?.classList.remove("hidden");
      populatePageWithData();
   }
   console.log(dataReady);
}

let loading = document.createElement("div");
document.querySelector(".content")?.classList.add("hidden");
loading.style.perspective = "200px";
loading.classList.add("absolute", "top-0", "left-0", "w-full", "h-full", "bg-white", "-z-100", "flex", "items-center", "justify-center");
loading.appendChild(document.createElement("div")).classList.add("loading");
document.querySelector(".content")?.parentElement?.appendChild(loading);


getToken("github");
setTimeout(() => {
   // @ts-ignore
   getStatsData(username);
}, 1500);
