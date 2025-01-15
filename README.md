# README - Sistema de Painel de Leitos Hospitalares

## Descrição

Este projeto é uma aplicação que permite que médicos preencham uma planilha no Google Sheets, e as informações sejam automaticamente transpostas para um site dinâmico. O sistema organiza os dados em um painel Kanban, categorizando os pacientes por gênero e faixa etária (masculino, feminino e infantil).

A aplicação foi desenvolvida utilizando **Python** (FastAPI) para o backend e **Vue.js** para o frontend. Este README fornece instruções detalhadas para configurar, instalar e executar o projeto.

---

## Configuração do Ambiente de Desenvolvimento

### 1. Instalação do Python e Criação de Ambiente Virtual

Certifique-se de que o Python 3.9 ou superior esteja instalado em seu sistema.

1. **Crie o ambiente virtual:**
   ```bash
   python -m venv venv
   ```
2. **Ative o ambiente virtual:**
   - **Windows:**
     ```bash
     venv\Scripts\activate
     ```
   - **macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```
3. **Atualize o ****`pip`****:**
   ```bash
   pip install --upgrade pip
   ```

### 2. Instale as Dependências do Backend

Execute o comando abaixo para instalar as bibliotecas necessárias:

```bash
pip install fastapi uvicorn gspread pandas
```

---

## Configuração do Frontend (Vue.js)

### 1. Instalação do Node.js e Vite

Certifique-se de que o Node.js e o npm estão instalados. Em seguida:

1. **Instale o Vite (opcional):**
   ```bash
   npm create vite@latest frontend --template vue
   ```
2. **Instale as dependências do projeto Vue:**
   ```bash
   cd frontend
   npm install
   ```
3. **Execute o servidor de desenvolvimento do frontend:**
   ```bash
   npm run dev
   ```

---

## Configuração do Google Sheets

### 1. Obtenha as Credenciais do Google

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Crie um novo projeto ou selecione um existente.
3. Ative a API do Google Sheets.
4. Gere uma conta de serviço e baixe o arquivo `JSON` contendo as credenciais.
5. Renomeie este arquivo para `credenciais.json` e mova-o para o diretório raiz do backend.

### 2. Configure o ID da Planilha

1. Crie o arquivo `sheet_id.txt` no diretório do backend.
2. Insira o ID da sua planilha na primeira linha do arquivo.
3. Insira a senha de acesso na segunda linha do arquivo.

---

## Executando o Backend

1. Ative o ambiente virtual (se não estiver ativo):
   ```bash
   source venv/bin/activate
   ```
2. Execute o servidor FastAPI:
   ```bash
   uvicorn main:app --reload
   ```

O backend será executado em `http://127.0.0.1:8000`.

---

## Fluxo de Autenticação e Uso

### 1. Login

Acesse a interface web e forneça a senha definida no arquivo `sheet_id.txt`. A autenticação é necessária para acessar os dados da planilha.

### 2. Visualização de Dados

Os dados da planilha serão organizados em categorias (Masculino, Feminino, Infantil). Você pode alternar entre a visualização Kanban e uma tabela clicando no botão de troca.

---

## Estrutura do Projeto

```
.
├── backend/
│   ├── main.py
│   ├── credenciais.json
│   ├── sheet_id.txt
│   └── ...
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
└── README.md
```

---

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para criar um fork e enviar um pull request.

---

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

