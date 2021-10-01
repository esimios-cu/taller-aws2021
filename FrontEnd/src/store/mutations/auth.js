export default {
	setUserData(state, data) {
		if (data) {
			state.userData = data
			state.isLogin = true
			localStorage.setItem('userData', JSON.stringify(data))
		} else {
			state.userData = {}
			state.isLogin = false
		}
	}
}
