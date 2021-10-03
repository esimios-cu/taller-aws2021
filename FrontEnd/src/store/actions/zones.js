import { post } from './apiManager'
export default {
	async addZone(store, context) {
		try {
			const result = await post('addPolygons', context)
			return result
		} catch (err) {
			const response = err && err.response && err.response.data ? err.response.data : {}
			throw { code: -1, message: response.message || 'Ocurrió un error al agregar la zona' }
		}
	},
	async getZones(store, context) {
		try {
			const result = await post('getPolygons')
			return result
		} catch (err) {
			const response = err && err.response && err.response.data ? err.response.data : {}
			throw { code: -1, message: response.message || 'Ocurrió un error al obtener las zonas' }
		}
	}
}
