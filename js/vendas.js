let itensInventario = [];
let itensVenda = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeVendas();
});

function initializeVendas() {
    fetch('php/recuperar_inventario.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta da rede');
            }
            return response.json();
        })
        .then(data => {
            itensInventario = data;
            populateProdutoSelecionado();
        })
        .catch(error => {
            console.error(error);
            showNotification('Erro ao recuperar inventário. Tente novamente mais tarde.', 'error');
        });

    const form = document.getElementById('formVenda');
    const btnFinalizarVenda = document.getElementById('btnFinalizarVenda');
    const modal = document.getElementById('modalConfirmacao');
    const btnConfirmarVenda = document.getElementById('btnConfirmarVenda');
    const btnCancelarVenda = document.getElementById('btnCancelarVenda');

    form.addEventListener('submit', handleSubmitVenda);
    btnFinalizarVenda.addEventListener('click', showModal);
    btnConfirmarVenda.addEventListener('click', finalizarVenda);
    btnCancelarVenda.addEventListener('click', closeModal);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function populateProdutoSelecionado() {
    const selectProduto = document.getElementById('produtoSelecionado');
    selectProduto.innerHTML = '<option value="">Selecione um produto</option>';
    itensInventario.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.nome_produto} - ${item.quantidade} disponíveis`;
        option.setAttribute('data-quantidade', item.quantidade);
        option.setAttribute('data-valor', item.valor_unitario);
        selectProduto.appendChild(option);
    });

    selectProduto.addEventListener('change', atualizarDetalhesProduto);
}

function atualizarDetalhesProduto() {
    const selectProduto = document.getElementById('produtoSelecionado');
    const quantidade = selectProduto.selectedOptions[0].getAttribute('data-quantidade');
    const valor = selectProduto.selectedOptions[0].getAttribute('data-valor');

    document.getElementById('quantidade').max = quantidade;
    document.getElementById('quantidade').value = '';
    document.getElementById('valorVenda').value = valor;
}

function handleSubmitVenda(e) {
    e.preventDefault();

    const produtoId = document.getElementById('produtoSelecionado').value;
    const produtoNome = document.getElementById('produtoSelecionado').selectedOptions[0].textContent;
    const quantidade = Number(document.getElementById('quantidade').value);
    const valorVenda = Number(document.getElementById('valorVenda').value);
    const valorTotal = quantidade * valorVenda;

    const item = {
        id: produtoId,
        nome: produtoNome,
        quantidade: quantidade,
        valor: valorVenda,
        valorTotal: valorTotal
    };

    adicionarItemVenda(item);
    atualizarTabelaVendas();
    atualizarTotalVenda();
    e.target.reset();
    document.getElementById('produtoSelecionado').focus();
}

function adicionarItemVenda(item) {
    itensVenda.push(item);
    document.getElementById('btnFinalizarVenda').disabled = false;
    showNotification('Item adicionado com sucesso!');
}

function atualizarTabelaVendas() {
    const tbody = document.querySelector('#tabelaVendas tbody');
    tbody.innerHTML = '';

    itensVenda.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.nome}</td>
            <td>${item.quantidade}</td>
            <td>R$ ${item.valor.toFixed(2)}</td>
            <td>R$ ${item.valorTotal.toFixed(2)}</td>
            <td>
                <button 
                    class="btn btn-danger btn-sm" 
                    onclick="removerItemVenda(${index})"
                    aria-label="Remover ${item.nome}"
                >
                    Remover
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function atualizarTotalVenda() {
    const total = itensVenda.reduce((acc, item) => acc + item.valorTotal, 0);
    document.getElementById('totalVenda').textContent = `R$ ${total.toFixed(2)}`;
}

function removerItemVenda(index) {
    itensVenda.splice(index, 1);
    atualizarTabelaVendas();
    atualizarTotalVenda();

    if (itensVenda.length === 0) {
        document.getElementById('btnFinalizarVenda').disabled = true;
    }

    showNotification('Item removido com sucesso!');
}

function showModal() {
    document.getElementById('modalConfirmacao').classList.add('active');
    document.getElementById('btnConfirmarVenda').focus();
}

function closeModal() {
    document.getElementById('modalConfirmacao').classList.remove('active');
    document.getElementById('btnFinalizarVenda').focus();
}

function finalizarVenda() {
    const dadosVenda = {
        itens: itensVenda,
        total: itensVenda.reduce((acc, item) => acc + item.valorTotal, 0),
        data: new Date().toISOString(),
        usuario: getCookie('loggedUserName')
    };

    fetch('php/processar_venda.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosVenda)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'sucesso') {
            showNotification('Venda finalizada com sucesso!');
            closeModal();
            resetarFormulario();
            atualizarInventario();
            if (typeof atualizarTabelaProdutos === 'function') {
                atualizarTabelaProdutos();
            }
        } else {
            showNotification('Erro ao finalizar a venda. Tente novamente.', 'error');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        showNotification('Erro ao finalizar a venda. Tente novamente.', 'error');
    });
}

function atualizarInventario() {
    fetch('php/recuperar_inventario.php')
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Erro ao recuperar inventário: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            itensInventario = data;
            populateProdutoSelecionado();
        })
        .catch(error => {
            console.error(error);
            showNotification('Erro ao recuperar inventário. Tente novamente mais tarde.', 'error');
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
    itensVenda = [];
    atualizarTabelaVendas();
    atualizarTotalVenda();
    document.getElementById('btnFinalizarVenda').disabled = true;
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