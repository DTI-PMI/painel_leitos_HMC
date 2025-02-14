import { createWebHistory, createRouter } from 'vue-router'

import KanbanBoard from '../components/KanbanBoard.vue'
import InternacaoBoard from '../components/InternacaoBoard.vue'

const routes = [
    { path: '/observacao', component: KanbanBoard },
    { path: '/internacao', component: InternacaoBoard }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router