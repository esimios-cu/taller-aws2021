import auth from './auth'
export default {
	...auth,
	changeApiUrl(state, data) {
		console.log('data', data)
		if (data) {
			state.apiUrl = data
			localStorage.setItem('apiUrl', state.apiUrl)
		} else {
			localStorage.removeItem('apiUrl')
		}
	}
}
