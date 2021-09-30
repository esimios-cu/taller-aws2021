import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/login',
		name: 'Login',
		component: Login,
		meta: {
			requiresAuth: false
		}
	},
	{
		path: '/register',
		name: 'Register',
		component: Register,
		meta: {
			requiresAuth: false
		}
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})
const allowPathRoutes = router.matcher.getRoutes().map(item => {
	return item.path
})
allowPathRoutes.push('/')
router.beforeEach((to, from, next) => {
	if (allowPathRoutes.indexOf(to.path) === -1) {
		next({ name: 'Home' })
	} else {
		const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
		const isLogin = store.state.isLogin
		if (!isLogin && requiresAuth !== false) {
			next({ name: 'Login' })
		} else {
			next()
		}
	}
})
export default router
