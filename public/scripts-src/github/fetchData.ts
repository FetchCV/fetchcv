// @ts-nocheck
async function getUserInfo() {
   try {
      const response = await fetch(`https://api.github.com/users/${username}`, header);
      if (response.ok) {
         userData = await response.json();
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