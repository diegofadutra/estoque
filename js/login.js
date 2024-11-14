document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    clearMessages();
    showLoading();

    const credentials = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };

    fetch('php/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        if (data.status === 'sucesso') {
            showSuccess(data.mensagem);
            console.log('Salvando informações do usuário em cookies:');
            console.log('loggedUserName:', data.usuario);
            console.log('loggedUserLogin:', credentials.username);
            setCookie('loggedUserName', data.usuario, 7); // Armazenar o nome do usuário em cookie
            setCookie('loggedUserLogin', credentials.username, 7); // Armazenar o login do usuário em cookie
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            showError(data.mensagem);
            document.getElementById('password').value = '';
            document.getElementById('password').focus();
        }
    })
    .catch(error => {
        hideLoading();
        showError('Erro no servidor. Tente novamente mais tarde.');
        console.error('Erro:', error);
    });
});

function clearMessages() {
    document.getElementById('loadingMessage').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
}

function showLoading() {
    document.getElementById('loadingMessage').style.display = 'block';
    document.getElementById('submitButton').disabled = true;
}

function hideLoading() {
    document.getElementById('loadingMessage').style.display = 'none';
    document.getElementById('submitButton').disabled = false;
}

function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorMessage').style.display = 'block';
}

function showSuccess(message) {
    document.getElementById('successMessage').textContent = message;
    document.getElementById('successMessage').style.display = 'block';
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
