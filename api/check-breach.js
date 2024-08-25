const fetch = require('node-fetch');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email } = req.body;
    const apiKey = process.env.HIBP_API_KEY; // Store your API key in Vercel environment variables
    const url = `https://haveibeenpwned.com/api/v3/breachedaccount/${email}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'hibp-api-key': apiKey
            }
        });

        if (response.ok) {
            const breaches = await response.json();
            res.status(200).json(breaches);
        } else if (response.status === 404) {
            res.status(404).json({ message: 'Not Found' });
        } else {
            res.status(500).json({ message: 'Error checking for breaches' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
