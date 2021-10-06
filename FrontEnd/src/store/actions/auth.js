import { post, setAuthorization } from './apiManager'
export default {
	async login(store, context) {
		try {
			const result = await post('signin', context)
			setAuthorization(result.data.accessToken)
			store.commit('setUserData', result.data)
			return result.data || {}
		} catch (err) {
			const response = err && err.response && err.response.data ? err.response.data : {}
			throw { code: -1, message: response.message || 'Ocurrió un error al hacer login' }
		}
	},
	async register(store, context) {
		try {
			const result = await post('signup', context)
			return result.data || {}
		} catch (err) {
			const response = err && err.response && err.response.data ? err.response.data : {}
			throw { code: -1, message: response.message || 'Ocurrió un error al registrar al usuario' }
		}
	},
	async logout(store, context) {
		try {
			const result = {} // await post('signout', context)
			store.commit('setUserData', null)
			return result.data || {}
		} catch (err) {
			const response = err && err.response && err.response.data ? err.response.data : {}
			throw { code: -1, message: response.message || 'Ocurrió un error al hacer logout' }
		}
	}
}
