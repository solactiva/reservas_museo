import axios from 'axios'

export const getConfiguracion = async () => {
	try {
		const response = await axios.get('/configuracion')
		return response.data
	} catch (error) {
		console.error(error)
	}
}
