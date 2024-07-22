// @ts-nocheck

//===============================================
// Username search
//===============================================

const usernameElement = document.getElementById("user-name") as HTMLInputElement;
const searchResultsElement = document.querySelector(".search-results");
const usernameInput = document.getElementById("user-name");

usernameElement.addEventListener("blur", (event) => {
   hideElement(searchResultsElement);
});

if (usernameInput) {
   usernameInput.addEventListener("keyup", (event) => {
      if (usernameElement.value.length > 0) {
         showElement(searchResultsElement);
         getUpdatedSearchResults(usernameElement.value);
      }
      else {
         hideElement(searchResultsElement);
         showUpdatedSearchResults([]);
      }
   });
}

async function getUpdatedSearchResults(search) {
   try {
      const response = await fetch(`/search/user/${search.replace("/", "slash")}`);
      if (response.ok) {
         let data = await response.json();
         showUpdatedSearchResults(data.users);
      }
   }
   catch (error) {
      console.error("Error fetching users - ", error); // should show to user
   }
}

function showUpdatedSearchResults(users) {
   searchResultsElement.innerHTML = "";
   for (let i = 0; i < users.length; i++) {
      let user = users[i];
      let userElement = document.createElement("div");
      createSearchResultElement(userElement, user.handle, user.profile.description);
      let divider = document.createElement("hr");
      divider.classList.add("dark:border-zinc-700");
      userElement.append(divider);
      searchResultsElement.append(userElement);
   }
   // Should only show if github username does exist
   if (usernameElement.value.length > 0) {
      let userElement = document.createElement("div");
      createSearchResultElement(userElement, "github/" + usernameElement.value, "No results? Try with their GitHub username");
      searchResultsElement.append(userElement);
   }
}

function createSearchResultElement(element, name, description) {
   element.innerHTML = `
      <div class="bg-white dark:bg-zinc-900 rounded-lg my-2 px-4 py-2">
         <a href="/user/${name}">
            <p class="text-lg">${name}</p>
            <p class="font-light">${description}</p>
         </a>
      </div>
   `;
}

function showElement(element) {
   if (element.classList.contains("hidden")) {
      element.classList.remove("hidden");
   }
}

function hideElement(element) {
   if (!element.classList.contains("hidden")) {
      element.classList.add("hidden");
   }
}
