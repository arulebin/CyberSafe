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

// Function to Base64 URL-safe encode the scan ID
function encodeScanId(scanId) {
    const base64Id = Buffer.from(scanId).toString('base64');
    const encodedId = base64Id.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    console.log('Encoded Scan ID:', encodedId);
    return encodedId;
}
// Function to get the report 
async function getUrlReport(scanId) {
    const encodedScanId = encodeScanId(scanId);
    const url = `https://www.virustotal.com/api/v3/urls/${encodedScanId}`;

    console.log('Fetching report for URL:', url);

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'x-apikey': API_KEY,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch Report Error Response:', errorText);
        throw new Error(`Error fetching report: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.error('Fetch Report Error Response:', errorText);
    return result;
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
