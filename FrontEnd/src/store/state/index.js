const userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : {}
export default { userData: userData, isLogin: Object.keys(userData).length > 0 }
