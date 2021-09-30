export default {
	setUserData(state, data) {
		if (data) {
			state.userData = data
			state.isLogin = true
		} else {
			state.userData = {}
			state.isLogin = false
		}
	}
}
