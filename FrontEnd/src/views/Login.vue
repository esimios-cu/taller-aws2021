<template>
	<div class="h100 bgEsime">
		<h1 class="title">Iniciar sesión</h1>
		<button v-if="status === 'USER_LOGIN'" @click="changeStatus('API_CONFIG')"><i class="fas fa-user-cog"></i></button>
		<button v-if="status === 'API_CONFIG'" @click="changeStatus('USER_LOGIN')"><i class="fas fa-user"></i></button>

		<form v-if="status === 'API_CONFIG'" action class="form w90" @submit.prevent="configApiUrl">
			<label class="form-label" for="#apiUrl">Url de los servicios:</label>
			<input class="form-input" v-model="currentApiUrl" type="url" id="apiUrl" required placeholder="Url del api" />
			<input class="form-submit" type="submit" value="Cambiar" />
			<input class="form-submit" @click="resetApiUrl" type="button" value="Reestablecer la original" />
		</form>
		<form v-if="status === 'USER_LOGIN'" action class="form pullUp" @submit.prevent="doLogin">
			<label class="form-label" for="#email">Email:</label>
			<input :disabled="loaders.doingLogin" class="form-input" v-model="email" type="email" id="email" required placeholder="Email" />
			<label class="form-label" for="#password">Contraseña:</label>
			<input :disabled="loaders.doingLogin" class="form-input" v-model="password" type="password" id="password" placeholder="Password" />
			<label class="form-label" for="#verificationCode">Codigo de verificación:</label>
			<input :disabled="loaders.doingLogin" class="form-input" v-model="verificationCode" type="number" id="verificationCode" placeholder="Código de verificación de email" />
			<sub>Agregar el código de verificación para validar su email</sub>
			<p v-if="error" class="error">{{ error }}</p>
			<pulse-loader class="m10" v-if="loaders.doingLogin"></pulse-loader>
			<input v-show="!loaders.doingLogin" class="form-submit" type="submit" value="Login" />
			<div v-show="!loaders.doingLogin" class="bottomLink"><a href="#" @click="toRegister">Ir al registro</a></div>
		</form>
	</div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
	name: 'Login',
	components: {
		PulseLoader
	},
	data: () => ({
		email: '',
		password: '',
		verificationCode: '',
		error: '',
		status: 'USER_LOGIN', // USER_LOGIN o API_CONFIG,
		currentApiUrl: '',
		loaders: {
			doingLogin: false
		}
	}),
	computed: {
		...mapState({ apiUrl: state => state.apiUrl })
	},
	async mounted() {
		this.currentApiUrl = this.apiUrl
	},
	methods: {
		...mapActions(['login']),
		...mapMutations(['changeApiUrl']),
		configApiUrl() {
			this.changeApiUrl(this.currentApiUrl)
			location.reload()
		},
		resetApiUrl() {
			this.changeApiUrl(null)
			location.reload()
		},
		changeStatus(status) {
			this.status = status
		},
		toRegister() {
			this.$router.push('/register')
		},
		async doLogin() {
			const params = {
				'username': this.email,
				'password': this.password
			}
			if (this.verificationCode) {
				params.verificationCode = this.verificationCode
			}
			console.log('params', params)
			this.loaders.doingLogin = true
			try {
				const result = await this.login(params)
				console.log('result', result)
				this.$router.push('/')
			} catch (error) {
				this.error = error.message
				console.error('error', error)
			} finally {
				this.loaders.doingLogin = false
			}
		}
	}
}
</script>

<style lang="css" scoped>
.title {
	text-align: center;
}
sub {
	color: white;
}
.pullUp {
	animation-duration: 1s;
	animation-name: pullUp;
}

@keyframes pullUp {
	from {
		margin-top: 30%;
	}

	to {
		margin: 3rem auto;
	}
}
</style>
