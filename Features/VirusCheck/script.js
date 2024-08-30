const urlInput = document.querySelector("#urlInput");
const submitBtn = document.querySelector("#submitBtn");

submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let url = urlInput.value;
    checkVirusUrl(url);
});

async function checkVirusUrl(url) {
    const response = await fetch("/api/check-virus-url.js", {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            url: url
        })
    })
    if (response.ok) {
        const result = await response.json();
        console.log('Result received from server:', result);
    }else {
        console.error('Error:', response.statusText);
    }
}