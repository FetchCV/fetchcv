// @ts-nocheck
//===============================================
// Username search
//===============================================
let usernameElement = document.getElementById("user-name");
const usernameInput = document.getElementById("user-name");
if (usernameInput) {
    usernameInput.addEventListener("keyup", (event) => {
        if (usernameElement.value.length > 0) {
            getUpdatedSearchResults(usernameElement.value);
        }
        else {
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
let searchResultsElement = document.querySelector(".search-results");
function showUpdatedSearchResults(users) {
    searchResultsElement.innerHTML = "";
    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        console.log(user);
        let userElement = document.createElement("div");
        createSearchResultElement(userElement, user.handle, user.profile.description);
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
      <div class="bg-red-500">
         <a href="/user/${name}">
            <p>${name}</p>
            <p>${description}</p>
         </a>
      </div>
   `;
}
