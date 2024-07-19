interface UserData {
    avatar_url: string,
    name: string,
    login: string,
    bio: string,
    public_repos: number,
    followers: number,
    following: number,
    location: string,
    email: string,
    blog: string,
    html_url: string,
    id: number
}

let userData: UserData;
let totalStars: number = 0;
let languages: [string, number][] = [];


async function loadPage() {
    await getToken("github");
    await getUserInfo();
    updateData();
    updateGithubStats();
    await getRepoData();
}

window.addEventListener("load", loadPage);