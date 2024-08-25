const fetch = require('node-fetch');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email } = req.body;
    const apiKey = process.env.HIBP_API_KEY;

    if (!apiKey) {
        console.error('API key is not defined');
        return res.status(500).json({ message: 'Server configuration error: API key missing' });
    }

    const url = `https://haveibeenpwned.com/api/v3/breachedaccount/${email}?truncateResponse=false`;

    try {
        console.log(`Making request to ${url} with API key ${apiKey}`);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'hibp-api-key': apiKey,
                'user-agent': 'YourAppName' // Some APIs require a user-agent header
            }
        });

        if (response.ok) {
            const breaches = await response.json();
            console.log('Breaches found:', breaches); // Log the breaches for debugging
            res.status(200).json(breaches);
        } else if (response.status === 404) {
            console.log('No breaches found for email:', email);
            res.status(404).json({ message: 'Not Found' });
        } else {
            const errorText = await response.text();
            console.error('API Error:', response.status, errorText);
            res.status(500).json({ message: 'Error checking for breaches', details: errorText });
        }
    } catch (error) {
        console.error('Server Error:', error.message);
        res.status(500).json({ message: 'Server Error', details: error.message });
    }
};
