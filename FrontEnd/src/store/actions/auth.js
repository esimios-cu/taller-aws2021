import { post, setAuthorization } from './apiManager'
export default {
	async login(store, context) {
		try {
			const result = await post('signin', context)
			setAuthorization(result.accessToken)
			console.log('result', result)
			store.commit('setUserData', result.data)
			return result
		} catch (err) {
			const response = err.response.data
			throw { code: -1, message: response.message || 'Ocurrió un error al hacer login' }
		}
	},
	async register(store, context) {
		try {
			const result = await post('signup', context)
			return result
		} catch (err) {
			const response = err.response.data
			throw { code: -1, message: response.message || 'Ocurrió un error al registrar al usuario' }
		}
	},
	async logout(store, context) {
		try {
			const result = null // await post('signout', context)
			store.commit('setUserData', null)
			return result
		} catch (err) {
			const response = err.response.data
			throw { code: -1, message: response.message || 'Ocurrió un error al hacer logout' }
		}
	}
}
