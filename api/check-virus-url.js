const fetch = require('node-fetch');
const API_KEY = process.env.VIRUSTOTAL_API_KEY;

if (!API_KEY) {
    console.error('VirusTotal API key is not defined');
    process.exit(1);
}

// Function to scan a URL using VirusTotal
async function scanUrl(urlToScan) {
    const url = 'https://www.virustotal.com/api/v3/urls';
    const params = new URLSearchParams();
    params.append('url', urlToScan);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'x-apikey': API_KEY,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error scanning URL: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Scan result:', result);
    return result.data.id;
}

// Function to get the report 
async function getUrlReport(scanId) {
    const url = `https://www.virustotal.com/api/v3/analyses/${scanId}`;  // Use analysis endpoint

    console.log('Fetching report for URL:', url);

    let status = 'queued';
    while (status === 'queued') {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-apikey': API_KEY,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error fetching report: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        status = result.data.attributes.status;

        if (status === 'queued') {
            console.log('Scan is queued. Checking again...');
            await new Promise(resolve => setTimeout(resolve, 5000));
        } else if (status === 'completed') {
            console.log('Scan completed:', result);
            return result;
        } else {
            console.log('Scan status:', status);
        }
    }
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ message: 'No URL provided' });
    }

    try {
        const scanId = await scanUrl(url);
        const report = await getUrlReport(scanId);
        res.status(200).json(report);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: `Error scanning URL: ${error.message}` });
    }
};
