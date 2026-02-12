import { storeToRefs } from 'pinia'
import { getConfiguracion } from '@/services/configuracionService'
import { useConfiguracionStore } from '@/stores/configuracionStore'

export const useConfiguracion = () => {
	const configuracionStore = useConfiguracionStore()
	const { configuracion } = storeToRefs(configuracionStore)

	const loadConfiguracion = async () => {
		const response = await getConfiguracion()
		if (response.success) {
			configuracion.value = response.data
		}
	}

	return {
		loadConfiguracion,
		configuracion,
	}
}
