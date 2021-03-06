import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as VueGoogleMaps from 'vue2-google-maps'
import config from './json/config.json'

Vue.config.productionTip = false
Vue.use(VueGoogleMaps, {
	load: {
		key: config.googleApiKey
	},
	installComponents: true
})

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
