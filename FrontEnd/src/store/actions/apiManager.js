import axios from 'axios'
const ENDPOINT_PATH = 'https://kcbead0v4e.execute-api.us-east-2.amazonaws.com/dev_stage_taller_seguridad/'
const setAuthorization = token => {
	axios.defaults.headers.common['authorization'] = 'Bearer ' + token
}

if (localStorage.getItem('userData')) {
	const token = JSON.parse(localStorage.getItem('userData')).accessToken
	setAuthorization(token)
}

const post = (endpoint, data) => {
	return axios.post(ENDPOINT_PATH + endpoint, data)
}

export { setAuthorization, post, ENDPOINT_PATH }
