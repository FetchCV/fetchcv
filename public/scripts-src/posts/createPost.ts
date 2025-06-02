// @ts-nocheck

function createPost(event) {
   event.preventDefault();
   const form = event.target;
   const formData = new FormData(form);
   const postContent = (document.querySelector(".create-post-message") as HTMLTextAreaElement)?.value;

   if (!postContent.trim()) {
      showAlert("Post content cannot be empty.");
      return;
   }

   if (currentFiles.length === 0) {
      showAlert("Please upload at least one image or video.");
      return;
   }

   uploadImages(currentFiles)
      .then((urls) => {
         // log all info aobut form
         submitPost(postContent, urls);

         // clear form
         form.reset();
         currentFiles = [];
         previewArea.innerHTML = "Upload an image or video";
         showAlert("Post created successfully!");
      })
      .catch(error => {
         showAlert(`Error creating post: ${error.message}`);
      });
}

function submitPost(content: string, urls: string[]): void {
   console.log("Post Content:", content);
   console.log("Uploaded URLs:", urls);
   // submit, along with username (actually get from server) to server for creation. should push out to all listeners (socket maybe?)

   // on the server side, create a new schema for posts
   // when you get the id of the post, append it to a list the user has of posts

   fetch("/posts/create", {
      method: "POST",
      headers: {
         "Content-Type": "application/json"
      },
      body: JSON.stringify({
         content: content,
         urls: urls,
         datePosted: new Date()
      })
   }).then(response => response.json())
   .then((message) => {
      console.log("Recieved response", message);

      document.querySelector(".posts")?.append(createPostElement({
         content: content,
         urls: urls,
         authorName: "Hamza Nasher-Alneam",
         authorImage: "../images/logo.svg",
         datePosted: new Date(),
      }));
   })
   .catch(error => console.error("Error:", error));
}

async function uploadImages(files: File[]): Promise<string[]> {
   let urls = [];
   for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_code", "5219dd95-5672-44ca-8423-970afa123633");

      try {
         const response = await fetch("https://pictshare.hnasheralneam.dev/api/upload.php", {
            method: "POST",
            body: formData
         });
         const result = await response.json();
         if (result.status === "ok") {
            showAlert(`Uploaded: ${result.url}`);
            let url = result.url.replace("http://", "https://pictshare.hnasheralneam.dev");
            //@ts-ignore
            urls.push(url);
            console.log(`File uploaded: ${file.name} \n URL: ${url}`);
         } else {
            showAlert(`Error uploading ${file.name}: ${result.reason}`);
            console.error(`Upload failed for ${file.name}: ${result.reason}`);
         }
      } catch (error) {
         showAlert(`Network error uploading ${file.name}`);
         console.error(`Network error for ${file.name}:`, error);
      }
   }
   return urls;
}