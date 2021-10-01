import axios from 'axios'
const ENDPOINT_PATH = 'https://kcbead0v4e.execute-api.us-east-2.amazonaws.com/dev_stage_taller_seguridad/'

const setAuthorization = token => {
	axios.defaults.headers.common['authorization'] = 'Bearer ' + token
}
export default {
	async login(store, context) {
		try {
			console.log('context', context)
			const result = await axios.post(ENDPOINT_PATH + 'signin', context)
			setAuthorization(result.accessToken)
			store.commit('setUserData', result.data)
			return result
		} catch (err) {
			console.error(err)
			return 'Ocurrió un error al hacer login'
		}
	},
	async register(store, context) {
		try {
			const result = await axios.post(ENDPOINT_PATH + 'signup', context)
			return result
		} catch (err) {
			console.error(err)
			return { code: -1, message: 'Ocurrió un error al registrar al usuario' }
		}
	},
	async logout(store, context) {
		try {
			const result = await axios.post(ENDPOINT_PATH + 'signout', context)
			store.commit('setUserData', null)
			return result
		} catch (err) {
			console.error(err)
			return { code: -1, message: 'Ocurrió un error al hacer logout' }
		}
	}
}
