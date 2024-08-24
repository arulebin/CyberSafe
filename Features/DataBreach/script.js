const resultWrapper = document.getElementById('resultWrapper');
const resultText = document.getElementById('result');
//Radio buttons and inputs
const emailRad = document.getElementById('emailRad');
const passwordRad = document.getElementById('passwordRad');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');

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
    } else {
        dataInput = document.getElementById('passwordInput').value;
        checkPasswordPwned(dataInput);
        passwordInput.value="";
    }
});

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

