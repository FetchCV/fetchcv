async function getRateLimit() {
    if (header) {
        const response = await fetch('https://api.github.com/rate_limit', header);
        if (response.ok) {
            const data = await response.json();
        }
        else {
            console.error('Error fetching rate limit:', response.statusText);
        }
    }
}
