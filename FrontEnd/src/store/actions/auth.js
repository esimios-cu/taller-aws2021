import axios from 'axios'
const ENDPOINT_PATH = 'https://kcbead0v4e.execute-api.us-east-2.amazonaws.com/dev_stage_taller_seguridad/'

const setAuthorization = token => {
	axios.defaults.headers.common['authorization'] = 'Bearer ' + token
}
if (localStorage.getItem('userData')) {
	const token = JSON.parse(localStorage.getItem('userData')).accessToken
	setAuthorization(token)
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
			const response = err.response.data
			throw { code: -1, message: response.message || 'Ocurrió un error al hacer login' }
		}
	},
	async register(store, context) {
		try {
			const result = await axios.post(ENDPOINT_PATH + 'signup', context)
			return result
		} catch (err) {
			const response = err.response.data
			throw { code: -1, message: response.message || 'Ocurrió un error al registrar al usuario' }
		}
	},
	async logout(store, context) {
		try {
			const result = null // await axios.post(ENDPOINT_PATH + 'signout', context)
			store.commit('setUserData', null)
			return result
		} catch (err) {
			const response = err.response.data
			throw { code: -1, message: response.message || 'Ocurrió un error al hacer logout' }
		}
	}
}
