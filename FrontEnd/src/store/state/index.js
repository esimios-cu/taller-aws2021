const userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : {}
import { getApiUrl } from '../actions/apiManager'
export default { apiUrl: getApiUrl(), userData: userData, isLogin: Object.keys(userData).length > 0 }
