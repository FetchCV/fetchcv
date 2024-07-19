async function getId() {
   await getToken("github");
    try {
       const response = await fetch(`https://api.github.com/users/${username}`, header);
       if (response.ok) {
          return (await response.json()).id;
       }
    }
    catch (error) {
       console.error("Failed to fetch github id. Error - ", error);
    }
 }