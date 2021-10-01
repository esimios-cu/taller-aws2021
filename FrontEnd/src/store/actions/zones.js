import { post } from './apiManager'
export default {
	async addZone(store, context) {
		try {
			const result = await post('addZone', context)
			return result
		} catch (err) {
			const response = err.response.data
			throw { code: -1, message: response.message || 'Ocurrió un error al hacer login' }
		}
	},
	async getAllZones(store, context) {
		try {
			const result = await post('getAllZones')
			return result
		} catch (err) {
			const response = err.response.data
			throw { code: -1, message: response.message || 'Ocurrió un error al hacer login' }
		}
	}
}
