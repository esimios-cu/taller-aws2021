import axios from 'axios'
const ENDPOINT_PATH = 'https://reqres.in/api/'

export default {
	async login(store, context) {
		try {
			const result = await axios.post(ENDPOINT_PATH + 'login', context)
			store.commit('setUserData', result.data)
			return result
		} catch (err) {
			console.error(err)
			return 'Ocurrió un error al hacer login'
		}
	},
	async register(store, context) {
		try {
			const result = await axios.post(ENDPOINT_PATH + 'register', context)
			return result
		} catch (err) {
			console.error(err)
			return { code: -1, message: 'Ocurrió un error al registrar al usuario', data }
		}
	},
	async logout(store, context) {
		try {
			const result = await axios.post(ENDPOINT_PATH + 'logout', context)
			store.commit('setUserData', null)
			return result
		} catch (err) {
			console.error(err)
			return { code: -1, message: 'Ocurrió un error al hacer logout', data }
		}
	}
}
