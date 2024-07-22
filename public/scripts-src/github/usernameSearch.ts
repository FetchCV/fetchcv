// @ts-nocheck

//===============================================
// Username search
//===============================================

function newUsername() {
   let usernameElement = document.getElementById("username") as HTMLInputElement;
   if (usernameElement) {
      // @ts-ignore
      username = usernameElement.value;
      // @ts-ignore
      window.location.href = window.location.origin + "/user/github/" + username;
   }
}

const usernameInput = document.getElementById("username");
if (usernameInput) {
   usernameInput.addEventListener("keydown", (event) => {
      if (event.key == "Enter") {
         newUsername();
      }
   });
}
