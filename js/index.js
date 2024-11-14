// Verificar autenticação ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    setupMenuListeners();
    setupAccessibilityFeatures();
});

// Função para verificar autenticação
function checkAuthentication() {
    const loggedUserName = getCookie('loggedUserName');
    const loggedUserLogin = getCookie('loggedUserLogin');

    if (!loggedUserName || !loggedUserLogin) {
        showNotification('Sessão expirada. Redirecionando para a página de login...', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    // Atualiza o nome do usuário na interface
    document.getElementById('userNameDisplay').textContent = loggedUserName;
}

// Função para definir cookies
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Função para obter cookies
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Configurar listeners para os botões do menu
function setupMenuListeners() {
    const menuButtons = document.querySelectorAll('.menu-button');
    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove a classe active de todos os botões
            menuButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
            });
            // Adiciona a classe active ao botão clicado
            this.classList.add('active');
            this.setAttribute('aria-expanded', 'true');
            // Carrega o conteúdo da seção
            loadSection(this.dataset.section);
            // Anuncia a mudança de seção
            announcePageChange(this.textContent.trim());
        });
    });
}

// Configurar recursos de acessibilidade
function setupAccessibilityFeatures() {
    // Listener para tecla Esc
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.classList.contains('menu-button')) {
                document.querySelector('#mainContent').focus();
            }
        }
    });

    // Suporte a navegação por teclado no menu
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

// Função para carregar o conteúdo da seção
function loadSection(section) {
    const mainContent = document.getElementById('mainContent');
    
    switch(section) {
        case 'vendas':
            window.location.href = 'vendas.html';
            break;
        case 'compras':
            window.location.href = 'compras.html';
            break;
        case 'produtos':
            window.location.href = 'produtos.html';
            break;
        case 'clientes':
            window.location.href = 'clientes.html';
            break;
        case 'usuarios':
            window.location.href = 'usuarios.html';
            break;
        default:
            window.location.href = 'index.html';
    }
}

// Função para anunciar mudança de página para leitores de tela
function announcePageChange(pageName) {
    const notification = document.getElementById('notifications');
    notification.textContent = `Carregando seção: ${pageName}`;
    setTimeout(() => {
        notification.textContent = '';
    }, 1000);
}

// Função para exibir notificações
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

// Função de logout
function logout() {
    showNotification('Saindo do sistema...', 'info');
    setTimeout(() => {
        console.log("Redirecionando para login.html"); // Adicionado para debugging
        document.cookie = 'loggedUserName=; Max-Age=-99999999;'; // Remover o cookie
        document.cookie = 'loggedUserLogin=; Max-Age=-99999999;'; // Remover o cookie
        window.location.href = 'login.html';
    }, 1000);
}

// Função para alternar o menu lateral em dispositivos móveis
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const isOpen = sidebar.classList.toggle('active');
    sidebar.setAttribute('aria-expanded', isOpen);
}
