document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('Input');
    const resultWrapper = document.getElementById('resultWrapper');
    ;
    function getStrengthMessage(score) {
        switch (score) {
            case 0:
                return { message: 'Very Weak', color: '#e74c3c' };
            case 1:
                return { message: 'Weak', color: '#e67e22' };
            case 2:
                return { message: 'Fair', color: '#f1c40f' };
            case 3:
                return { message: 'Good', color: '#3498db' };
            case 4:
                return { message: 'Strong', color: '#2ecc71' };
            default:
                return { message: '', color: 'black' };
        }
    }

    inputField.addEventListener('input', () => {
        const password = inputField.value;
        if (password === "") {
            resultWrapper.innerHTML = "";
            return;
        }
        const result = zxcvbn(password);
        const strengthMessage = getStrengthMessage(result.score);
        resultWrapper.innerHTML = `<p style="color: ${strengthMessage.color};">${strengthMessage.message}</p>
                                   <p>${result.feedback.suggestions.join(' ')}</p>`;
    });
});
