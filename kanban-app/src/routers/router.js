import { createWebHashHistory, createRouter } from 'vue-router'

import KanbanBoard from '../components/KanbanBoard.vue'
import InternacaoBoard from '../components/InternacaoBoard.vue'

const routes = [
    { path: '/', component: KanbanBoard },
    { path: '/internacao', component: InternacaoBoard }
]

const router = createRouter({
    history: createWebHashHistory(`/painel-leitos-HMC`),
    base: `/painel-leitos-HMC`,
    routes,
})

export default router