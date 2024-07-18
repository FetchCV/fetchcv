// @ts-nocheck
//===============================================
// On load
//===============================================

// First check for username
window.addEventListener("load", () => {
   getUserInfo();
});


//===============================================
// Setting username
//===============================================

function newUsername() {
   hideError();
   let usernameElement = document.getElementById("username") as HTMLInputElement;
   if (usernameElement) {
      // @ts-ignore
      username = usernameElement.value;
      // @ts-ignore
      window.location.href = window.location.origin + "/user/github/" + username;
      getUserInfo();
   }
}

const usernameInput = document.getElementById("username");
if (usernameInput) {
   usernameInput.addEventListener("keydown", function (event) {
      if (event.key == "Enter") {
         newUsername();
      }
   });
}


