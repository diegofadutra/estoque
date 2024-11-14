# Sistema de Gerenciamento de Estoque

Bem-vindo ao Sistema de Gerenciamento de Estoque! Este projeto foi desenvolvido para ajudar a gerenciar o inventário de produtos, registrar vendas e compras, e manter o controle de estoque atualizado.

## Funcionalidades

- **Registro de Produtos**: Adicione e visualize produtos no inventário.
- **Gerenciamento de Compras**: Registre novas compras e adicione produtos ao inventário.
- **Gerenciamento de Vendas**: Registre vendas, atualize o inventário e calcule o total da venda.
- **Registro de Usuários**: Cadastre novos usuários para gerenciar o acesso ao sistema.
- **Notificações**: Receba notificações sobre ações realizadas no sistema (adicionar, remover, finalizar vendas, etc).

## Tecnologias Utilizadas

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: PHP
- **Banco de Dados**: MySQL


## Configuração

### Pré-requisitos

- Servidor web (Apache, Nginx, etc.)
- PHP
- MySQL

### Passos para Configuração

1. **Clone o repositório**:
   ```sh
   git clone https://https://github.com/diegofadutra/estoque.git

2. **Configure o banco de dados**:

- Crie um banco de dados MySQL.
- Importe o arquivo db_schema.sql (se disponível) para configurar as tabelas.

3. **Atualize as credenciais do banco de dados**:

- Abra o arquivo php/db_connection.php.
- Atualize as variáveis $servername, $username, $password e $dbname com as credenciais do seu banco de dados.

4. **Inicie o servidor web**:

- Coloque os arquivos no diretório raiz do seu servidor web (ex: htdocs no XAMPP).
- Acesse http://localhost/estoque no seu navegador.

## Uso

### Registro de Produtos

- Navegue até a seção "Produtos" no menu lateral.
- Visualize os produtos existentes no inventário.
- Adicione novos produtos (se a funcionalidade estiver disponível).

### Registro de Compras

- Navegue até a seção "Compras" no menu lateral.
- Preencha o formulário para adicionar novos produtos ao inventário.
- Confirme a compra para atualizar o inventário.

### Registro de Vendas

- Navegue até a seção "Vendas" no menu lateral.
- Selecione os produtos, indique a quantidade e adicione-os à venda.
- Finalize a venda para atualizar o inventário.

### Registro de Usuários

- Navegue até a seção "Usuários" no menu lateral.
- Visualize os usuários registrados no sistema.
- Adicione novos usuários preenchendo o formulário de cadastro.
- Edite ou remova usuários conforme necessário.

## Contribuição

- Faça um fork do projeto.
- Crie uma nova branch (git checkout -b feature/nova-funcionalidade).
- Faça commit das suas alterações (git commit -am 'Adicionar nova funcionalidade').
- Faça push para a branch (git push origin feature/nova-funcionalidade).
- Abra um Pull Request.

### Licença
Este projeto está licenciado sob a Licença MIT. Consulte o arquivo LICENSE para mais informações.