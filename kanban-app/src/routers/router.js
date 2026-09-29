import { createWebHashHistory, createRouter } from "vue-router";

import KanbanBoard from "../components/KanbanBoard.vue";
import InternacaoBoard from "../components/InternacaoBoard.vue";
import MaternidadeBoard from "../components/MaternidadeBoard.vue";

const routes = [
  { path: "/", component: KanbanBoard },
  { path: "/internacao", component: InternacaoBoard },
  { path: "/maternidade", component: MaternidadeBoard },
];

const router = createRouter({
  history: createWebHashHistory(`/painel-leitos-HMC`),
  base: `/painel-leitos-HMC`,
  routes,
});

export default router;
