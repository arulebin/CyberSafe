const urlInput = document.querySelector("#urlInput");
const submitBtn = document.querySelector("#submitBtn");

submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    
    const url = urlInput.value.trim();
    if (!url) {
        console.error('URL cannot be empty');
        return;
    }
    
    submitBtn.disabled = true;
    try {
        await checkVirusUrl(url);
    } catch (error) {
        console.error('An unexpected error occurred:', error);
    } finally {
        submitBtn.disabled = false;
    }
});

async function checkVirusUrl(url) {
    try {
        const response = await fetch("/api/check-virus-url", { 
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ url: url })
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Result received from server:', result);
        } else {
            const errorMessage = await response.text();
            console.error(`Error (${response.status}): ${errorMessage}`);
        }
    } catch (error) {
        console.error('Network or server error:', error.message);
    }
}
