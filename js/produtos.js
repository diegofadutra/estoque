document.addEventListener('DOMContentLoaded', function() {
    console.log('Página carregada. Iniciando atualização da tabela de produtos.');
    atualizarTabelaProdutos();
});

function atualizarTabelaProdutos() {
    fetch('php/recuperar_inventario.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta da rede');
            }
            return response.json();
        })
        .then(data => {
            const tabelaProdutos = document.getElementById('tabelaProdutos').getElementsByTagName('tbody')[0];
            tabelaProdutos.innerHTML = ''; // Limpa a tabela antes de preencher
            
            let totalEstoque = 0;

            data.forEach(item => {
                const valorUnitario = parseFloat(item.valor_unitario);
                const quantidade = parseInt(item.quantidade, 10);
                const valorTotal = quantidade * valorUnitario;

                if (isNaN(valorUnitario) || isNaN(valorTotal)) {
                    console.error('Valor inválido para o item:', item);
                } else {
                    totalEstoque += valorTotal;
                }

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.nome_produto}</td>
                    <td>${quantidade}</td>
                    <td>R$ ${isNaN(valorUnitario) ? 'N/A' : valorUnitario.toFixed(2)}</td>
                    <td>R$ ${isNaN(valorTotal) ? 'N/A' : valorTotal.toFixed(2)}</td>
                `;
                tabelaProdutos.appendChild(tr);
            });

            // Atualiza o valor total em estoque
            document.getElementById('totalEstoque').textContent = `R$ ${totalEstoque.toFixed(2)}`;
        })
        .catch(error => {
            console.error('Erro ao recuperar inventário:', error);
            alert('Erro ao recuperar inventário: ' + error.message);
        });
}