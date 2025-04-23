<template>
    <h1 v-if="!logged" style="color: #444;">Autenticação</h1>
    <div v-if="!logged" class="login-container">
        <form @submit.prevent="tentarLogin" class="login-form">
            <h2 class="error-message">{{ error }}</h2>
            <div class="form-group">
                <label for="password" style="color: #444;">Senha de acesso:</label>
                <input id="password" type="password" v-model="input_password" :disabled="logging" class="input-field"
                    placeholder="Digite sua senha">
            </div>
            <button type="submit" :disabled="logging" class="submit-button">
                Enviar
            </button>
        </form>
    </div>

    <h2 v-if="loading && Object.keys(kanbanData).length === 0" style="color: black">Carregando...</h2>

    <div v-if="!tableView && !loading && logged">
        <div class="category-header">
            <div class="kanban-cards">
                <div class="kanban-card" v-for="(card, index) in paginatedKanbanData" :key="index"
                    :class="{ highlight_yellow: card.ESPEC === 'CC', highlight_purpple: card.ESPEC === 'PED', highlight_green: card.ESPEC === 'ORT', highlight_orange: card.ESPEC === 'CM', highlight_blue: card.ESPEC === 'OTO', highlight_red: card.ESPEC === 'VASC', highlight_brown: card.ESPEC === 'BUCO', highlight_stblue: card.ESPEC === 'PSQ' }">
                    <div v-if="card.NOME">
                        <div class="card-row texto-grande">
                            <span><strong>{{ card.LEITO }} {{ card.TP }}</strong></span>
                        </div>
                        <div class="card-row texto-grande">
                            <span>{{ card.NOME || "" }}, {{ card.ID }}</span>
                        </div>
                        <div class="card-row texto-grande">
                            <span>DI: {{ card.DI }}<strong> - {{ card.ESPEC ? nomeAbreviado(card.ESPEC) : ""
                                    }}</strong></span>
                        </div>
                        <div class="card-row texto-grande">
                            <span><strong>PENDÊNCIAS:</strong> {{ card.PENDENCIAS || "" }}</span>
                        </div>
                        <div class="card-row texto_medio">
                            <span><strong>{{ card.DIAGNOSTICO ? "Diagnóstico:" : "" }}</strong> {{ card.DIAGNOSTICO
                                }}</span>
                        </div>
                    </div>
                    <div v-else>
                        <div class="leito_livre">
                            <p><strong>{{ card.LEITO }}</strong></p>
                            <h1 style="color: green;">Livre</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="table-category" v-if="tableView && !loading && logged">

        <div class="table-view">
            <div class="table-row table-header-row">
                <div class="card-row texto-grande table-cell table-cell-header" style="width:100px">
                    <span><strong>Leito</strong></span>
                </div>
                <div class="card-row texto-grande table-cell table-cell-header" style="width:210px">
                    <span><strong>Paciente</strong></span>
                </div>
                <div class="card-row texto-grande table-cell table-cell-header" style="width:135px">
                    <span><strong>TP</strong></span>
                </div>

                <div class="card-row texto-grande table-cell table-cell-header" style="width:110px">
                    <span><strong>DI</strong></span>
                </div>
                <div class="card-row texto-grande table-cell table-cell-header" style="width:110px">
                    <span><strong>ESPEC.</strong></span>
                </div>
                <div class="card-row texto-grande table-cell table-cell-header" style="width:380px">
                    <span><strong>PENDÊNCIAS</strong></span>
                </div>
                <div class="card-row texto-grande table-cell table-cell-header" style="width:450px">
                    <span><strong>Diagnóstico</strong></span>
                </div>
            </div>
            <div class="kanban-card table-row" v-for="(card, index) in paginatedKanbanData" :key="index"
                :class="{ highlight_yellow: card.ESPEC === 'CC', highlight_purpple: card.ESPEC === 'PED', highlight_green: card.ESPEC === 'ORT', highlight_orange: card.ESPEC === 'CM', highlight_blue: card.ESPEC === 'OTO', highlight_red: card.ESPEC === 'VASC', highlight_brown: card.ESPEC === 'BUCO', highlight_stblue: card.ESPEC === 'PSQ' }">
                <div class="card-row texto-grande table-cell">
                    <span><strong>{{ card.LEITO }}</strong></span>
                </div>
                <div class="card-row texto-grande table-cell">
                    <span>{{ card.NOME ? (nomeAbreviado(card.NOME) + (card.ID ? ", " + card.ID : "")) : "" }}</span>
                </div>
                <div class="card-row texto-grande table-cell">
                    <span><strong>{{ card.TP }}</strong></span>
                </div>
                <div class="card-row texto-grande table-cell">
                    <span>{{ card.DI }}</span>
                </div>
                <div class="card-row texto-grande table-cell">
                    <span><strong>{{ card.ESPEC || "" }}</strong></span>
                </div>
                <div class="card-row texto-grande table-cell">
                    <span><strong>{{ card.PENDENCIAS || "" }}</strong></span>
                </div>
                <div class="card-row texto-grande table-cell" style="width:60px">
                    <span> {{ card.DIAGNOSTICO || " " }} </span>
                </div>
            </div>
        </div>
    </div>
    <div class="carousel-controls" v-if="logged && Object.keys(kanbanData).length > 0">
        <button @click="prevPage">Anterior</button>
        <button @click="nextPage">Próximo</button>
        <button @click="tableView = !tableView">
            {{ tableView ? "Ver Cards" : "Ver Tabela" }}
        </button>
    </div>
</template>

<script>
export default {
    name: "KanbanView",
    data() {
        return {
            tableView: false,
            kanbanData: {},
            logged: false,
            logging: false,
            loading: false,
            error: "",
            input_password: "",
            currentPage: 0,
            itemsPerPage: 15,
            firstLoad: true,
        };
    },
    computed: {
        filteredKanbanData() {
            return Object.values(this.kanbanData).filter((card) => card.NOME);
        },
        paginatedKanbanData() {
            const start = this.currentPage * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredKanbanData.slice(start, end);
        },
    },
    methods: {
        async tentarLogin() {
            console.log(this); // Veja o que está sendo exibido no console
            this.logging = true;
            try {
                const url = window.location.protocol == "https:" ? "https://leitos-api.ilhabela.sp.gov.br" : window.location.protocol + "//" + window.location.hostname + ":8000"
                const response = await fetch(url + "/authenticate/", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ "input_password": this.input_password, "unidade": "internacao" }),
                });
                const data = await response.json();

                if (data["status"] == "success") {
                    this.logged = true;
                    this.updateKanbanData()
                } else {
                    this.error = "Senha incorreta."
                    this.input_password = ""
                }
            } catch (error) {
                console.error(error);
                this.error = "Um erro inesperado ocorreu; entre em contato com os desenvolvedores."
            }
            this.logging = false;
        },
        async updateKanbanData() {
            if (this.logged) {
                if (this.firstLoad) {
                    this.loading = true;
                    this.firstLoad = false;
                }
                try {
                    const url = window.location.protocol == "https:" ? "https://leitos-api.ilhabela.sp.gov.br" : window.location.protocol + "//" + window.location.hostname + ":8000"
                    const response = await fetch(url + "/kanban-data/internacao", {
                        headers: {
                            "password": this.input_password
                        }
                    });
                    const data = await response.json();
                    console.log("Dados recebidos:", data);
                    if (data["status"] == "error") {
                        this.logged = false;
                        this.error = "O login expirou; favor realizar login novamente."
                        this.kanbanData = {}
                        this.input_password = ""
                        this.firstLoad = true;
                    } else if ("error" in data) {
                        this.logged = false;
                        this.error = "Um erro inesperado ocorreu; entre em contato com os desenvolvedores."
                        this.kanbanData = {}
                        this.input_password = ""
                        this.firstLoad = true;
                    } else {
                        this.kanbanData = data;
                    }
                } catch (error) {
                    console.error("Erro ao buscar dados:", error);
                    this.logged = false;
                    this.error = "Um erro inesperado ocorreu; entre em contato com os desenvolvedores."
                    this.kanbanData = {}
                    this.input_password = ""
                    this.firstLoad = true;
                } finally {
                    this.loading = false;
                }
            }
        },
        nomeAbreviado(nome) {
            var split = nome.split(" ")
            var result = ""
            split.forEach(function (value, index) {
                if (index == 0) result += value.slice(0, 1).toUpperCase() + value.slice(1)
                else result += value.slice(0, 1).toUpperCase() + "."
                result += " "
            })
            return result.slice(0, -1)
        },
        nextPage() {
            if (this.currentPage < Math.ceil(this.filteredKanbanData.length / this.itemsPerPage) - 1) {
                this.currentPage++;
            } else {
                this.currentPage = 0;
            }
        },
        prevPage() {
            if (this.currentPage > 0) {
                this.currentPage--;
            } else {
                this.currentPage = Math.ceil(this.filteredKanbanData.length / this.itemsPerPage) - 1;
            }
        },
    },
    async mounted() {
        setInterval(() => {
            this.updateKanbanData()
        }, 40000);

        setInterval(() => {
            this.nextPage();
        }, 30000);
    },
};
</script>

<style scoped>
#app {
    background-color: #f7f7f7;
    height: 100%;
}

.button_change {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 15px 32px;
    text-decoration: none;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 8px;
    position: absolute;
    right: 10px;
    top: 10px;
}

.kanban-category {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 12px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    min-height: 28vh;
}

.table-category {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 12px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 5px;
    min-height: 26vh;
}

.category-header {
    display: flex;
    flex-direction: row;
    width: 100%;
    min-height: 26vh;
}

.category-title {
    writing-mode: vertical-rl;
    text-align: center;
    padding: 10px 5px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    height: auto;
    white-space: nowrap;
}

.table-title {
    writing-mode: vertical-rl;
    text-align: center;
    padding: 10px 5px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    height: auto;
    white-space: nowrap;
    margin-right: 10px;
}

.kanban-cards {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(3, auto);
    gap: 25px 20px;
    width: 100%;
    padding: 15px;
}

.kanban-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 10px;
    width: 320px;
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 1px solid #ddd;
    min-height: 245px;
}

.kanban-card.highlight_purpple {
    border-color: #966396;
    background-color: #f7d5ff;
}

.kanban-card.highlight_yellow {
    border-color: #ffee00;
    background-color: #ffffd9;
}

.kanban-card.highlight_green {
    border-color: #00ff00;
    background-color: #e4ffe0;
}

.kanban-card.highlight_orange {
    border-color: #e28f4b;
    background-color: #ffd6bf;
}

.kanban-card.highlight_blue {
    border-color: #6eb3e0;
    background-color: #d4e2ff;
}

.highlight_stblue {
    border-color: #6eb3e0;
    background-color: #d4e2ff;
}

.highlight_red {
    border-color: #ff0000;
    background-color: #ffcccc;
}

.highlight_brown {
    border-color: #8B4513;
    background-color: #D2B48C;
}

.card-row {
    text-align: left;
    font-size: 15.125px;
    color: #333;
}

.card-row strong {
    color: #555;
}

.leito_livre {
    justify-content: center;
    align-items: center;
    font-size: 22px;
    color: #333;
}

.texto-grande {
    font-size: 22px;
}

.texto_medio {
    font-size: 18px;
}

/* Login form Rafa Teste*/

.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.login-form {
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    width: 100%;
    max-width: 400px;
}

.error-message {
    color: #e74c3c;
    font-size: 14px;
    margin-bottom: 15px;
    text-align: center;
}

.form-group {
    margin-bottom: 15px;
}

.label {
    font-size: 14px;
    color: #ccc;
}

.input-field {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    box-sizing: border-box;
    color: #333;
    background-color: #ddd;
}

.input-field:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
}

.submit-button {
    width: 100%;
    padding: 10px 15px;
    background-color: #3498db;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
}

.submit-button:hover {
    background-color: #2980b9;
}

.submit-button:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
}

.table-view {
    display: table;
    width: 100%;
    border-collapse: collapse;
}

.table-row {
    display: table-row;
}

.table-cell {
    display: table-cell;
    padding: 8.5px;
    border: 1px solid #ddd;
    text-align: left;
}

.table-cell-header {
    font-weight: bold;
    background-color: #f9f9f9;
}

.table-header-row {
    background-color: #f2f2f2;
}

.carousel-controls {
    display: flex;
    margin-top: 10px;
    justify-content: center;
    align-items: center;
    gap: 5px;

}

.carousel-controls button {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 10px 20px;
    text-decoration: none;
    font-size: 16px;
    margin: 0 5px;
    cursor: pointer;
    border-radius: 8px;
}
</style>