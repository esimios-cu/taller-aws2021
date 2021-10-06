import { post } from './apiManager'
export default {
	async addZone(store, context) {
		try {
			const result = await post('createPolygon', context)
			return result.data || {}
		} catch (err) {
			const response = err && err.response && err.response.data ? err.response.data : {}
			throw { code: -1, message: response.message || 'Ocurrió un error al agregar la zona' }
		}
	},
	async getZones(store, context) {
		try {
			const result = await post('readPolygons')
			return result.data || {}
		} catch (err) {
			const response = err && err.response && err.response.data ? err.response.data : {}
			throw { code: -1, message: response.message || 'Ocurrió un error al obtener las zonas' }
		}
	}
}
