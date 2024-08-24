const emailRad = document.getElementById('emailRad');
const passwordRad = document.getElementById('passwordRad');
emailRad.addEventListener("click",toggleCheckType);
passwordRad.addEventListener("click",toggleCheckType);
function toggleCheckType() {
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    if (document.querySelector('input[name="checkType"]:checked').value === 'password') {
        emailInput.style.display = 'none';
        passwordInput.style.display = 'block';
      } else {
        emailInput.style.display = 'block';
        passwordInput.style.display = 'none';
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
            return `Password found ${count} times in data breaches!`;
        }
    }
    return "Password not found in any known data breaches.";
}

//hashes the password using the SHA-1 algorithm
async function sha1(str) {
    const buffer = new TextEncoder('utf-8').encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex.toUpperCase();
}