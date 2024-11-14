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
            localStorage.setItem('loggedUser', data.usuario); // Armazenar o nome do usuário
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
