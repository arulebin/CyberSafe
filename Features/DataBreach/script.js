const resultWrapper = document.getElementById('resultWrapper');
const resultText = document.getElementById('result');
//Radio buttons and inputs
const emailRad = document.getElementById('emailRad');
const passwordRad = document.getElementById('passwordRad');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const optInSection=document.getElementById("opt-in-section");
optInSection.classList.add('hidden');

emailRad.addEventListener("click", toggleCheckType);
passwordRad.addEventListener("click", toggleCheckType);

function toggleCheckType() {
    resultText.textContent='';
    resultWrapper.className = 'result-wrapper'
    if (document.querySelector('input[name="checkType"]:checked').value === 'password') {
        emailInput.style.display = 'none';
        passwordInput.style.display = 'block';
        emailInput.removeAttribute('required');
        passwordInput.setAttribute('required', '');
    } else {
        emailInput.style.display = 'block';
        passwordInput.style.display = 'none';
        passwordInput.removeAttribute('required');
        emailInput.setAttribute('required', '');
    }
}
//On submit call respective functions
const submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", (e) => {
    e.preventDefault();  
    const checkType = document.querySelector('input[name="checkType"]:checked').value;
    let dataInput;
    if (checkType === "email") {
        dataInput = document.getElementById('emailInput').value;
        checkEmailBreach(dataInput);
    } else {
        dataInput = document.getElementById('passwordInput').value;
        checkPasswordPwned(dataInput);
        passwordInput.value="";
    }
});

//Email Breach
async function checkEmailBreach(email) {
    try {
        const response = await fetch('/api/check-breach', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            const breaches = await response.json();
            console.log('Breaches received from server:', breaches);

            if (breaches.length > 0) {
                resultText.innerHTML = "";

                breaches.forEach(breach => {
                    const breachContainer = document.createElement('div');
                    breachContainer.classList.add('breach-container');

                    const breachLogo = document.createElement('img');
                    breachLogo.src = breach.LogoPath || 'default-logo.png';
                    breachLogo.alt = breach.Name + " logo";
                    breachContainer.appendChild(breachLogo);

                    const breachDetails = document.createElement('div');
                    breachDetails.classList.add('breach-details');

                    const breachTitle = document.createElement('h3');
                    breachTitle.textContent = breach.Title || 'No Title';
                    breachDetails.appendChild(breachTitle);

                    const breachDescription = document.createElement('p');
                    breachDescription.innerHTML = breach.Description || 'No Description';
                    breachDetails.appendChild(breachDescription);

                    const dataClasses = document.createElement('p');
                    if (breach.DataClasses && Array.isArray(breach.DataClasses)) {
                        dataClasses.textContent = `Data Compromised: ${breach.DataClasses.join(", ")}`;
                    } else {
                        dataClasses.textContent = "Data Compromised: None";
                    }
                    breachDetails.appendChild(dataClasses);

                    breachContainer.appendChild(breachDetails);

                    resultText.appendChild(breachContainer);
                });

                resultWrapper.className = 'result-wrapper breach-found';
            } else {
                resultText.textContent = "Your email has not been found in any known data breaches.";
                resultWrapper.className = 'result-wrapper no-breach';
            }
            optInSection.classList.remove('hidden');
        } else if (response.status === 404) {
            resultText.textContent = "Your email has not been found in any known data breaches.";
            resultWrapper.className = 'result-wrapper no-breach';
        } else {
            const errorText = await response.text();
            console.error('API Response Error:', response.status, errorText);
            resultText.textContent = "An error occurred while checking for breaches.";
            resultWrapper.className = 'result-wrapper breach-error';
        }
    } catch (error) {
        console.error('Error:', error);
        resultText.textContent = "An error occurred while checking for breaches.";
        resultWrapper.className = 'result-wrapper breach-error';
    }
}

//Check password in data breach
async function checkPasswordPwned(password) {
    const sha1Password = await sha1(password);
    const prefix = sha1Password.slice(0, 5);
    const suffix = sha1Password.slice(5).toUpperCase();

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const data = await response.text();

    const hashes = data.split('\n');
    for (const hash of hashes) {
        const [h, count] = hash.split(':');
        if (h === suffix) {
            resultText.textContent= `Password found ${count} times in data breaches! Change your password ASAP!!`;
            resultWrapper.className = 'result-wrapper breach-found';
            return;
        }
    }
    resultText.textContent = "Password not found in any known data breaches.";
    resultWrapper.className = 'result-wrapper no-breach';
}

//hashes the password using the SHA-1 algorithm
async function sha1(str) {
    const buffer = new TextEncoder('utf-8').encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex.toUpperCase();
}

function optInB() {
    displayMessage("You have opted in for future breach notifications. Thank you!");
}

function optOutB() {
    displayMessage("You have opted out of future breach notifications.");
}

function displayMessage(message) {
    const responseMessage = document.getElementById('response-message');
    responseMessage.querySelector('p').textContent = message;
    responseMessage.classList.remove('hidden');
}
