<template>
    <h1 v-if="!logged" style="color: #444">Autenticação</h1>
    <div v-if="!logged" class="login-container">
        <form @submit.prevent="tentarLogin" class="login-form">
            <h2 class="error-message">{{ error }}</h2>
            <div class="form-group">
                <label for="password" style="color: #444"
                    >Senha de acesso:</label
                >
                <input
                    id="password"
                    type="password"
                    v-model="input_password"
                    :disabled="logging"
                    class="input-field"
                    placeholder="Digite sua senha"
                />
            </div>
            <button type="submit" :disabled="logging" class="submit-button">
                Enviar
            </button>
        </form>
    </div>

    <button
        @click="tableView = !tableView"
        class="button_change"
        v-if="logged && Object.keys(kanbanData).length > 0"
    >
        {{ tableView ? "Ver Cards" : "Ver Tabela" }}
    </button>

    <h2
        v-if="loading && Object.keys(kanbanData).length === 0"
        style="color: black"
    >
        Carregando...
    </h2>

    <div v-if="!tableView && !loading && logged">
        <div class="category-header">
            <div class="kanban-cards">
                <div
                    class="kanban-card"
                    v-for="(card, index) in sortedKanbanData"
                    :key="index"
                >
                    <div v-if="card.NOME">
                        <div class="card-row texto-grande">
                            <span
                                ><strong
                                    >{{ getEnfermariaName(card.ENFERMARIA) }} —
                                    LEITO {{ card.LEITO }}</strong
                                ></span
                            >
                        </div>
                        <div class="card-row texto-grande">
                            <span
                                >{{ card.NOME.trim() || ""
                                }}{{
                                    card.IDADE ? ", " + card.IDADE : ""
                                }}</span
                            >
                        </div>
                        <div class="card-row texto_medio">
                            <span
                                ><strong>ABO:</strong>
                                {{ card.ABO || "" }}</span
                            >
                        </div>
                        <div class="card-row texto_medio">
                            <span
                                ><strong>DIETA:</strong>
                                {{ card.DIETA || "" }}</span
                            >
                        </div>
                        <div class="card-row texto_medio">
                            <span
                                ><strong>ALERGIAS:</strong>
                                {{ card.ALERGIAS || "" }}</span
                            >
                        </div>
                        <div class="card-row texto_medio">
                            <span
                                ><strong>{{
                                    card.DIAGNOSTICO ? "DIAGNÓSTICO:" : ""
                                }}</strong>
                                {{ card.DIAGNOSTICO }}</span
                            >
                        </div>
                        <div class="card-row texto_medio">
                            <span
                                ><strong>PROGRAMAÇÕES:</strong>
                                {{ card.PROGRAMACOES || "" }}</span
                            >
                        </div>
                    </div>
                    <div v-else>
                        <div class="leito_livre">
                            <p>
                                <strong
                                    >{{ getEnfermariaName(card.ENFERMARIA) }} —
                                    LEITO {{ card.LEITO }}</strong
                                >
                            </p>
                            <h1 style="color: green">Livre</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="table-category" v-if="tableView && !loading && logged">
        <div class="table-view">
            <div class="table-row table-header-row">
                <div
                    class="card-row texto-grande table-cell table-cell-header"
                    style="width: 100px"
                >
                    <span><strong>Enf.</strong></span>
                </div>
                <div
                    class="card-row texto-grande table-cell table-cell-header"
                    style="width: 100px"
                >
                    <span><strong>Leito</strong></span>
                </div>
                <div
                    class="card-row texto-grande table-cell table-cell-header"
                    style="width: 210px"
                >
                    <span><strong>Paciente</strong></span>
                </div>
                <div
                    class="card-row texto-grande table-cell table-cell-header"
                    style="width: 110px"
                >
                    <span><strong>ABO</strong></span>
                </div>

                <div
                    class="card-row texto-grande table-cell table-cell-header"
                    style="width: 135px"
                >
                    <span><strong>Dieta</strong></span>
                </div>
                <div
                    class="card-row texto-grande table-cell table-cell-header"
                    style="width: 135px"
                >
                    <span><strong>Alergias</strong></span>
                </div>
                <div
                    class="card-row texto-grande table-cell table-cell-header"
                    style="width: 380px"
                >
                    <span><strong>Programações</strong></span>
                </div>
                <div
                    class="card-row texto-grande table-cell table-cell-header"
                    style="width: 450px"
                >
                    <span><strong>Diagnóstico</strong></span>
                </div>
            </div>
            <div
                class="kanban-card table-row"
                v-for="(card, index) in kanbanData"
                :key="index"
            >
                <div class="card-row texto-grande table-cell">
                    <span
                        ><strong>{{
                            card.ENFERMARIA.replace(
                                "OBSERVAÇÃO",
                                "OBS.",
                            ).replace("Z|", "")
                        }}</strong></span
                    >
                </div>
                <div class="card-row texto-grande table-cell">
                    <span
                        ><strong>{{ card.LEITO }}</strong></span
                    >
                </div>
                <div class="card-row texto-grande table-cell">
                    <span>{{
                        card.NOME
                            ? nomeAbreviado(card.NOME) +
                              (card.IDADE ? ", " + card.IDADE : "")
                            : ""
                    }}</span>
                </div>
                <div class="card-row texto-grande table-cell">
                    <span>{{ card.ABO }}</span>
                </div>
                <div class="card-row texto-grande table-cell">
                    <span>{{ card.DIETA }}</span>
                </div>
                <div class="card-row texto-grande table-cell">
                    <span>{{ card.ALERGIAS }}</span>
                </div>
                <div class="card-row texto-grande table-cell">
                    <span>{{ card.PROGRAMACOES }}</span>
                </div>
                <div class="card-row texto-grande table-cell">
                    <span>{{ card.DIAGNOSTICO || " " }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "MaternidadeView",
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
        sortedKanbanData() {
            return this.kanbanData.sort((a, b) =>
                a.ENFERMARIA.localeCompare(b.ENFERMARIA),
            );
        },
    },
    methods: {
        async tentarLogin() {
            this.logging = true;
            try {
                const url =
                    window.location.protocol == "https:"
                        ? "https://leitos-api.ilhabela.sp.gov.br"
                        : window.location.protocol +
                          "//" +
                          window.location.hostname +
                          ":8000";
                const response = await fetch(url + "/authenticate/", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        input_password: this.input_password,
                        unidade: "maternidade",
                    }),
                });
                const data = await response.json();

                if (data["status"] == "success") {
                    this.logged = true;
                    this.updateKanbanData();
                } else {
                    this.error = "Senha incorreta.";
                    this.input_password = "";
                }
            } catch (error) {
                console.error(error);
                this.error =
                    "Um erro inesperado ocorreu; entre em contato com os desenvolvedores.";
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
                    const url =
                        window.location.protocol == "https:"
                            ? "https://leitos-api.ilhabela.sp.gov.br"
                            : window.location.protocol +
                              "//" +
                              window.location.hostname +
                              ":8000";
                    const response = await fetch(
                        url + "/kanban-data/maternidade",
                        {
                            headers: {
                                password: this.input_password,
                            },
                        },
                    );
                    const data = await response.json();
                    console.log("Dados recebidos:", data);
                    if (data["status"] == "error") {
                        this.logged = false;
                        this.error =
                            "O login expirou; favor realizar login novamente.";
                        this.kanbanData = {};
                        this.input_password = "";
                        this.firstLoad = true;
                    } else if ("error" in data) {
                        this.logged = false;
                        this.error =
                            "Um erro inesperado ocorreu; entre em contato com os desenvolvedores.";
                        this.kanbanData = {};
                        this.input_password = "";
                        this.firstLoad = true;
                    } else {
                        this.kanbanData = data;
                    }
                } catch (error) {
                    console.error("Erro ao buscar dados:", error);
                    this.logged = false;
                    this.error =
                        "Um erro inesperado ocorreu; entre em contato com os desenvolvedores.";
                    this.kanbanData = {};
                    this.input_password = "";
                    this.firstLoad = true;
                } finally {
                    this.loading = false;
                }
            }
        },
        nomeAbreviado(nome) {
            var split = nome.split(" ");
            var result = "";
            split.forEach(function (value, index) {
                if (index == 0)
                    result += value.slice(0, 1).toUpperCase() + value.slice(1);
                else result += value.slice(0, 1).toUpperCase() + ".";
                result += " ";
            });
            return result.slice(0, -1);
        },
        getEnfermariaName(enf) {
            try {
                if (Number.isInteger(Number(enf))) return "ENF. " + enf;
                return enf.replace("Z|", "");
            } catch {
                return enf.replace("Z|", "");
            }
        },
    },
    async mounted() {
        setInterval(() => {
            this.updateKanbanData();
        }, 40000);
    },
};
</script>
<style scoped>
#app {
    background-color: #f7f7f7;
    height: 100%;
}

.button_change {
    background-color: #4caf50;
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
    grid-template-columns: repeat(4, 1fr);
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
    width: 410px;
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 1px solid #ddd;
    min-height: 255px;
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
    border-color: #8b4513;
    background-color: #d2b48c;
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
    background-color: #4caf50;
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
