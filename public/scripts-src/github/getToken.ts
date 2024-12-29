let TOKEN: string;
let tokenRecieved: boolean = false;
let header: RequestInit | undefined = {};


async function getToken(service: string) {
   const response = await fetch(`/token/${service}`);
   if (response.ok) {
      const token = await response.text() as string;
      tokenRecieved = true;
      TOKEN = token;
      header = {
         'headers': {
            'Authorization': `token ${TOKEN}`
         }
      }
      console.log("Token Recieved");
   } else {
      showError("Token Error", "Failed to fetch token. Try reloading the page.", "bg-red-800");
      console.error('Error fetching token:', response.statusText);
   }
}