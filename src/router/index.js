import { createWebHistory, createRouter } from 'vue-router'

import Home from '@/pages/Home.vue'
import RegistroVisitante from '@/pages/RegistroVisitante.vue'
import PagoVisitante from '@/pages/PagoVisitante.vue'
import Eventos from '@/pages/Eventos.vue'

const routes = [
	{
		path: '/',
		name: 'Eventos',
		component: Eventos,
	},
	{
		path: '/:idEvento',
		name: 'Home',
		component: Home,
	},
	{
		path: '/registro',
		name: 'RegistroVisitante',
		component: RegistroVisitante,
	},
	{
		path: '/pago',
		name: 'PagoVisitante',
		component: PagoVisitante,
	},
	{
		path: '/realizado',
		name: 'PagoRealizado',
		component: () => import('@/pages/PagoRealizado.vue'),
	},
	{
		path: '/rechazado',
		name: 'ReservaRechazada',
		component: () => import('@/pages/ReservaRechazada.vue'),
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
