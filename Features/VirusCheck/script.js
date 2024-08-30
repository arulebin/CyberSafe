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
        const result = await checkVirusUrl(url);
    } catch (error) {
        console.error('An unexpected error occurred:', error);
    } finally {
        submitBtn.disabled = false;
    }
});

function displayResults(data) {
    const resultWrapper = document.getElementById("resultWrapper");
    resultWrapper.innerHTML = '';

    if (data.attributes && data.attributes.results) {
        const results = data.attributes.results;
        for (const engine in results) {
            const { engine_name, result, category } = results[engine];
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');

            let bgColor;
            if (category === "harmless") {
                bgColor = "linear-gradient(135deg, #7fff7f, #4cff4c)";
            } else if (category === "malicious") {
                bgColor = "linear-gradient(135deg, #ff7f7f, #ff4c4c)";
            } else if (category === "undetected") {
                bgColor = "linear-gradient(135deg, #fff700, #ffd700)";
            } else {
                bgColor = "linear-gradient(135deg, #e0e0e0, #c0c0c0)";
            }

            resultItem.style.background = bgColor;

            resultItem.innerHTML = `
                <h5>${engine_name}</h5>
                <p>Category: ${category}</p>
                <p>Result: ${result}</p>
            `;
            resultWrapper.appendChild(resultItem);
        }
    } else {
        resultWrapper.innerHTML = '<p>No results found.</p>';
    }
}

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
            console.log('Scan result:', result);
            displayResults(result);
            return result;
        } else {
            const errorMessage = await response.text();
            console.error(`Error (${response.status}): ${errorMessage}`);
            throw new Error(`Error (${response.status}): ${errorMessage}`);
        }
    } catch (error) {
        console.error('Network or server error:', error.message);
        throw error;
    }
}
