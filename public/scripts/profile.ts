//===============================================
// On load
//===============================================

// First check for username
window.addEventListener("load", () => {
   username = githubUserData.login;
   getUserInfo();
});

//===============================================
// Show user errors
//===============================================

function showError(errorTitle: string, errorText: string, color: string) {
   let errorBox = document.querySelector(".error-box");
   if (errorBox) {
      errorBox.classList.remove("hidden");
      errorBox.classList.remove("bg-green-800");
      errorBox.classList.remove("bg-red-800");
      errorBox.classList.remove("bg-blue-800");
      errorBox.classList.add(color);
   }

   let errorTitleElement = document.querySelector(".error-title");
   let errorTextElement = document.querySelector(".error-text");

   if (errorTitleElement) {
      errorTitleElement.innerHTML = errorTitle;
   }
   if (errorTextElement) {
      errorTextElement.innerHTML = errorText;
   }
}

function hideError() {
   let errorBox = document.querySelector(".error-box");
   if (errorBox) {
      errorBox.classList.add("hidden");
   }
}
