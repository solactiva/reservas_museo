import { defineStore } from 'pinia'

export const useConfiguracionStore = defineStore('configuracion', {
	state: () => {
		return {
			configuracion: {
				qrPago: '',
				tiempoEspera: 10,
			},
		}
	},
})
