let TOKEN;
let tokenRecieved = false;
let header = {};
async function getToken(service) {
    const response = await fetch(`/token/${service}`);
    if (response.ok) {
        const token = await response.text();
        tokenRecieved = true;
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
