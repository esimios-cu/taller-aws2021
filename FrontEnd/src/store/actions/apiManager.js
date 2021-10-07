import axios from 'axios'
import config from '@/json/config.json'
const ENDPOINT_PATH = localStorage.getItem('apiUrl') || config.urlApi

const getApiUrl = () => {
	return ENDPOINT_PATH
}
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

export { setAuthorization, post, getApiUrl }
