document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    setupMenuListeners();
    setupAccessibilityFeatures();

    document.getElementById('btnCadastro').addEventListener('click', showCadastroSection);
    document.getElementById('btnConsulta').addEventListener('click', showConsultaSection);
    document.getElementById('formCadastro').addEventListener('submit', cadastrarUsuario);
});

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
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function checkAdminPrivileges() {
    const loggedUserLogin = getCookie('loggedUserLogin');
    console.log('Login do usuário atual:', loggedUserLogin); // Adicionado para debugging
    return loggedUserLogin === 'admin'; // Verificar se o login do usuário é "admin"
}

function showCadastroSection() {
    if (!checkAdminPrivileges()) {
        showNotification('Acesso negado. Apenas administradores podem cadastrar novos usuários.', 'error');
        return;
    }

    document.getElementById('cadastroSection').classList.remove('hidden');
    document.getElementById('consultaSection').classList.add('hidden');
}

function showConsultaSection() {
    document.getElementById('cadastroSection').classList.add('hidden');
    document.getElementById('consultaSection').classList.remove('hidden');
    carregarUsuarios();
}

function cadastrarUsuario(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const login = document.getElementById('login').value;
    const senha = document.getElementById('senha').value;

    if (!nome || !login || !senha || senha.length !== 6 || !/^\d+$/.test(senha)) {
        showNotification('Por favor, preencha todos os campos corretamente.', 'error');
        return;
    }

    fetch('php/cadastrar_usuario.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, login, senha })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'sucesso') {
            showNotification(data.mensagem, 'success');
            document.getElementById('formCadastro').reset();
        } else {
            showNotification(data.mensagem, 'error');
        }
    })
    .catch(error => console.error('Erro:', error));
}

function carregarUsuarios() {
    fetch('php/recuperar_usuarios.php')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('.users-table tbody');
            tbody.innerHTML = ''; // Limpar tabela antes de adicionar novos dados

            const loggedUserLogin = getCookie('loggedUserLogin');

            data.forEach((usuario, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${usuario.nome}</td>
                    <td>${usuario.login}</td>
                    <td>
                        ${checkAdminPrivileges() && usuario.login !== 'admin' ? `<button class="btn btn-danger" onclick="confirmarExclusaoUsuario(${usuario.id})">Excluir</button>` : ''}
                        ${usuario.login === loggedUserLogin ? `<button class="btn btn-warning" onclick="mostrarPopupAlteracaoSenha('${usuario.login}')">Alterar Senha</button>` : ''}
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => console.error('Erro ao recuperar usuários:', error));
}

function confirmarExclusaoUsuario(id) {
    if (confirm('Você tem certeza que deseja excluir este usuário?')) {
        excluirUsuario(id);
    }
}

function excluirUsuario(id) {
    fetch('php/excluir_usuario.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'sucesso') {
            showNotification(data.mensagem, 'success');
            carregarUsuarios();
        } else {
            showNotification(data.mensagem, 'error');
        }
    })
    .catch(error => console.error('Erro ao excluir usuário:', error));
}

function mostrarPopupAlteracaoSenha(login) {
    const popup = document.createElement('div');
    popup.innerHTML = `
        <div class="popup-overlay">
            <div class="popup-content">
                <h3>Alterar Senha</h3>
                <form id="formAlteracaoSenha" data-login="${login}">
                    <div class="form-group">
                        <label for="senhaAtual">Senha Atual:</label>
                        <input type="password" id="senhaAtual" name="senhaAtual" required>
                    </div>
                    <div class="form-group">
                        <label for="novaSenha">Nova Senha:</label>
                        <input type="password" id="novaSenha" name="novaSenha" required pattern="\\d{6}" title="A senha deve conter 6 números">
                    </div>
                    <div class="form-group">
                        <label for="confirmaNovaSenha">Confirmar Nova Senha:</label>
                        <input type="password" id="confirmaNovaSenha" name="confirmaNovaSenha" required pattern="\\d{6}" title="A senha deve conter 6 números">
                    </div>
                    <button type="submit" class="btn btn-success">Alterar Senha</button>
                    <button type="button" class="btn btn-secondary" onclick="fecharPopupAlteracaoSenha()">Cancelar</button>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(popup);

    document.getElementById('formAlteracaoSenha').addEventListener('submit', alterarSenha);
}

function fecharPopupAlteracaoSenha() {
    document.querySelector('.popup-overlay').remove();
}

function alterarSenha(event) {
    event.preventDefault();

    const login = event.target.dataset.login;
    const senhaAtual = document.getElementById('senhaAtual').value;
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmaNovaSenha = document.getElementById('confirmaNovaSenha').value;

    if (novaSenha !== confirmaNovaSenha) {
        showNotification('A nova senha e a confirmação não coincidem.', 'error');
        return;
    }

    fetch('php/alterar_senha.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login, senhaAtual, novaSenha })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'sucesso') {
            showNotification(data.mensagem, 'success');
            fecharPopupAlteracaoSenha();
        } else {
            showNotification(data.mensagem, 'error');
        }
    })
    .catch(error => console.error('Erro ao alterar senha:', error));
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
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
