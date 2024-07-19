let TOKEN;
let tokenRecieved = false;
let header = {};
async function getToken(service) {
    // console.log("Fetching token...");
    const response = await fetch(`/token/${service}`);
    if (response.ok) {
        const token = await response.text();
        tokenRecieved = true;
        // console.log("Token received.");
        TOKEN = token;
        header = {
            'headers': {
                'Authorization': `token ${TOKEN}`
            }
        };
    }
    else {
        showError("Token Error", "Failed to fetch token. Try reloading the page.", "bg-red-800");
        console.error('Error fetching token:', response.statusText);
    }
}
