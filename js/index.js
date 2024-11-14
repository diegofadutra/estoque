document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    setupMenuListeners();
    setupAccessibilityFeatures();
});

function checkAuthentication() {
    const loggedUser = localStorage.getItem('loggedUser');
    if (!loggedUser) {
        showNotification('Sessão expirada. Redirecionando para a página de login...', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    fetch('php/check_session.php', {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'invalido') {
            showNotification('Sessão expirada. Redirecionando para a página de login...', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            document.getElementById('userNameDisplay').textContent = data.usuario;
        }
    })
    .catch(error => {
        console.error('Erro ao verificar autenticação:', error);
        showNotification('Erro no servidor. Redirecionando para a página de login...', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });
}

function setupMenuListeners() {
    const menuButtons = document.querySelectorAll('.menu-button');
    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
            menuButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            loadSection(this.getAttribute('href'));
        });
    });
}

function loadSection(sectionHref) {
    window.location.href = sectionHref;
}

function setupAccessibilityFeatures() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.classList.contains('menu-button')) {
                document.querySelector('#mainContent').focus();
            }
        }
    });

    const menuButtons = document.querySelectorAll('.menu-button');
    menuButtons.forEach((button, index) => {
        button.addEventListener('keydown', function(e) {
            let targetButton = null;

            switch(e.key) {
                case 'ArrowDown':
                    targetButton = menuButtons[index + 1] || menuButtons[0];
                    break;
                case 'ArrowUp':
                    targetButton = menuButtons[index - 1] || menuButtons[menuButtons.length - 1];
                    break;
                case 'Home':
                    targetButton = menuButtons[0];
                    break;
                case 'End':
                    targetButton = menuButtons[menuButtons.length - 1];
                    break;
            }

            if (targetButton) {
                e.preventDefault();
                targetButton.focus();
            }
        });
    });
}

function showNotification(message, type = 'info') {
    const notifications = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notifications.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function logout() {
    fetch('php/logout.php', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'sucesso') {
            showNotification(data.mensagem, 'info');
            setTimeout(() => {
                localStorage.removeItem('loggedUser');
                window.location.href = 'login.html';
            }, 1000);
        } else {
            showNotification('Erro ao realizar logout. Tente novamente.', 'error');
        }
    })
    .catch(error => {
        console.error('Erro ao realizar logout:', error);
        showNotification('Erro no servidor. Tente novamente mais tarde.', 'error');
    });
}
