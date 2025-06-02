// @ts-nocheck
interface PostData {
  author: {
    name: string;
    profileLink: string;
    githubLink: string;
    avatarSrc: string;
  };
  content: string;
  images: string[];
  postedAgo: string;
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("/posts/get-all")
    .then(response => response.json())
    .then(reponse => {
      console.log("Posts fetched:", reponse);
      const postsContainer = document.querySelector(".posts");
      if (postsContainer) {
        reponse.posts.reverse().forEach(async (post: PostData) => {
          await fetch("https://api.github.com/users/hnasheralneam")
            .then(response => response.json())
            .then(data => {
              const avatarUrl = data.avatar_url;
              post.authorImage = avatarUrl;
            })
            .catch(error => console.error('Error fetching data:', error));
          const postElement = createPostElement(post);
          postsContainer.appendChild(postElement);
        });
      } else {
        console.error("Posts container not found.");
      }
    });
});



// other stuff
function createPostElement(data: PostData): HTMLDivElement {
  const postElement = document.createElement("div");
  postElement.classList.add("mx-auto", "py-6", "px-12", "my-4", "bg-zinc-100", "dark:bg-far-h-dark", "border", "border-zinc-300", "dark:border-zinc-700", "rounded-md", "max-w-[600px]");


postElement.innerHTML = `
   <div class="grid" style="grid-template-columns: 4rem auto">
      <img class="m-[.3rem] w-[3.5rem] border border-far-b-dark rounded-full" src="${data.authorImage || "../images/logo.svg"}" alt="profile-picture">
      <div class="flex items-center pl-2 text-left">
         <div>
            <p class="leading-none text-xl font-semibold">${data.authorHandle}</p>
            <p class="text-closer-b-dark dark:text-far-h-light">
               <a class="hover:underline" href="/user/${data.authorHandle}">Profile</a> |
               <a class="hover:underline" href="https://github.com/${data.authorHandle}">GitHub</a>
            </p>
         </div>
      </div>
   </div>
   <p class="mt-2 mb-6">${data.content}</p>
   <div class="my-2 bg-farther-light dark:bg-farther-dark rounded-xl overflow-hidden relative">
      <div class="relative">
         <div class="carousel-images flex transition-transform duration-300 ease-in-out" style="transform: translateX(0%);">
            ${data.urls.map(imageSrc => {
               const videoMatch = imageSrc.match(/\.(mp4|webm|ogg)$/i);
               if (videoMatch) {
                  const extension = videoMatch[1].toLowerCase();
                  let videoMimeType = "";
                  switch (extension) {
                    case "mp4":
                      videoMimeType = "video/mp4";
                      break;
                    case "webm":
                      videoMimeType = "video/webm";
                      break;
                    case "ogg":
                      videoMimeType = "video/ogg";
                      break;
                  }
                  return `
                     <div class="w-full rounded-xl flex-shrink-0 flex justify-center items-center h-[350px] relative overflow-hidden">
                        <video class="relative max-w-full max-h-full z-10 shadow" controls style="background: #000; width: 100%; height: 100%; object-fit: contain;">
                           <source src="${imageSrc}/raw" type="${videoMimeType}">
                        </video>
                     </div>
                  `;
               } else {
                  return `
                     <div class="w-full rounded-xl flex-shrink-0 flex justify-center items-center h-[350px] relative overflow-hidden">
                        <img class="absolute inset-0 w-full h-full object-cover filter blur-lg scale-110 z-0" src="${imageSrc}" alt="blurred background">
                        <img class="relative max-w-full max-h-full z-10 shadow" src="${imageSrc}" alt="picture">
                     </div>
                  `;
               }
            }).join("")}
         </div>
         <button type="button" class="carousel-prev absolute left-2 top-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-700 rounded-full p-2 shadow shadow-neutral-800 hover:bg-gray-300 dark:hover:bg-gray-600 transition" aria-label="Previous image">&#8592;</button>
         <button type="button" class="carousel-next absolute right-2 top-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-700 rounded-full p-2 shadow shadow-neutral-800 hover:bg-gray-300 dark:hover:bg-gray-600 transition" aria-label="Next image">&#8594;</button>
      </div>
   </div>
   <p class="leading-none text-closer-b-dark text-right">posted on ${(new Date(data.datePosted)).toLocaleString()}</p>
`;

  // Add event listeners for the carousel buttons after the element is created
  setTimeout(() => {
    const images = postElement.querySelectorAll('.carousel-images > div');
    const carousel = postElement.querySelector('.carousel-images') as HTMLElement;
    const prevButton = postElement.querySelector('.carousel-prev') as HTMLButtonElement;
    const nextButton = postElement.querySelector('.carousel-next') as HTMLButtonElement;
    let current = 0;

    function updateCarousel() {
      carousel.style.transform = `translateX(-${current * 100}%)`;
      prevButton.style.display = images.length > 1 ? 'block' : 'none';
      nextButton.style.display = images.length > 1 ? 'block' : 'none';
    }

    prevButton.onclick = () => {
      current = (current - 1 + images.length) % images.length;
      updateCarousel();
    };
    nextButton.onclick = () => {
      current = (current + 1) % images.length;
      updateCarousel();
    };
    updateCarousel(); // Initial call to set button visibility
  }, 0); // Use setTimeout to ensure the element is in the DOM

  return postElement;
}