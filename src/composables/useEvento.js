import { storeToRefs } from 'pinia'
import { getEventos, getEvento } from '@/services/eventosService'
import { useEventoStore } from '@/stores/eventoStore'

export const useEvento = () => {
	const eventoStore = useEventoStore()
	const { evento, eventos } = storeToRefs(eventoStore)

	const cargarEvento = async (idEvento) => {
		const response = await getEvento(idEvento)
		evento.value = response.data
	}

	const cargarEventos = async () => {
		const response = await getEventos()
		eventos.value = response.data.filter(e => e.activo === true)
	}

	return {
		evento,
		eventos,
		cargarEvento,
		cargarEventos,
	}
}
