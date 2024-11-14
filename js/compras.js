// Array para armazenar os produtos
let produtos = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeCompras();
});

function initializeCompras() {
    const form = document.getElementById('formProduto');
    const btnFinalizar = document.getElementById('btnFinalizar');
    const modal = document.getElementById('modalConfirmacao');
    const btnConfirmar = document.getElementById('btnConfirmar');
    const btnCancelar = document.getElementById('btnCancelar');

    // Listeners
    form.addEventListener('submit', handleSubmitProduto);
    btnFinalizar.addEventListener('click', showModal);
    btnConfirmar.addEventListener('click', finalizarCompra);
    btnCancelar.addEventListener('click', closeModal);

    // Fecha modal com Esc
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function handleSubmitProduto(e) {
    e.preventDefault();

    const nome = document.getElementById('nomeProduto').value;
    const quantidade = Number(document.getElementById('quantidade').value);
    const valor = Number(document.getElementById('valor').value);
    const valorTotal = quantidade * valor;

    const produto = {
        nome,
        quantidade,
        valor,
        valorTotal
    };

    adicionarProduto(produto);
    atualizarTabelaProdutos();
    atualizarTotalCompra();
    e.target.reset();
    document.getElementById('nomeProduto').focus();
}

function adicionarProduto(produto) {
    produtos.push(produto);
    document.getElementById('btnFinalizar').disabled = false;
    showNotification('Produto adicionado com sucesso!');
}

function atualizarTabelaProdutos() {
    const tbody = document.querySelector('#tabelaProdutos tbody');
    tbody.innerHTML = '';

    produtos.forEach((produto, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${produto.nome}</td>
            <td>${produto.quantidade}</td>
            <td>R$ ${produto.valor.toFixed(2)}</td>
            <td>R$ ${produto.valorTotal.toFixed(2)}</td>
            <td>
                <button 
                    class="btn btn-danger btn-sm" 
                    onclick="removerProduto(${index})"
                    aria-label="Remover ${produto.nome}"
                >
                    Remover
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function atualizarTotalCompra() {
    const total = produtos.reduce((acc, produto) => acc + produto.valorTotal, 0);
    document.getElementById('totalCompra').textContent = `R$ ${total.toFixed(2)}`;
}

function removerProduto(index) {
    produtos.splice(index, 1);
    atualizarTabelaProdutos();
    atualizarTotalCompra();
    
    if (produtos.length === 0) {
        document.getElementById('btnFinalizar').disabled = true;
    }
    
    showNotification('Produto removido com sucesso!');
}

function showModal() {
    document.getElementById('modalConfirmacao').classList.add('active');
    document.getElementById('btnConfirmar').focus();
}

function closeModal() {
    document.getElementById('modalConfirmacao').classList.remove('active');
    document.getElementById('btnFinalizar').focus();
}

function finalizarCompra() {
    const dadosCompra = {
        produtos: produtos,
        total: produtos.reduce((acc, produto) => acc + produto.valorTotal, 0),
        data: new Date().toISOString(),
        usuario: getCookie('loggedUserName') // Usar o nome do usuário
    };

    fetch('php/processar_compra.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosCompra)
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        showNotification('Compra finalizada com sucesso!');
        closeModal();
        resetarFormulario();
    })
    .catch(error => {
        console.error('Erro:', error);
        showNotification('Erro ao finalizar a compra. Tente novamente.', 'error');
    });
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notifications');
    notification.textContent = message;
    notification.className = `notifications ${type}`;
    setTimeout(() => {
        notification.textContent = '';
    }, 3000);
}

function resetarFormulario() {
    produtos = [];
    atualizarTabelaProdutos();
    atualizarTotalCompra();
    document.getElementById('btnFinalizar').disabled = true;
}

// Função para obter cookies
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
