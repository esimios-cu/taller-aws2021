<template>
	<div class="h100 bgEsime">
		<h1 class="title">Iniciar sesión</h1>
		<form action class="form" @submit.prevent="doLogin">
			<label class="form-label" for="#email">Email:</label>
			<input class="form-input" v-model="email" type="email" id="email" required placeholder="Email" />
			<label class="form-label" for="#password">Contraseña:</label>
			<input class="form-input" v-model="password" type="password" id="password" placeholder="Password" />
			<p v-if="error" class="error">{{ error }}</p>
			<input class="form-submit" type="submit" value="Login" />

			<div class="bottomLink"><a href="#" @click="toRegister">Ir al registro</a></div>
		</form>
	</div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
	data: () => ({
		email: '',
		password: '',
		error: ''
	}),
	methods: {
		toRegister() {
			this.$router.push('/register')
		},
		...mapActions(['login']),
		async doLogin() {
			const paramas = {
				'username': this.email,
				'password': this.password
			}
			console.log('params', paramas)
			try {
				const result = await this.login(paramas)
				console.log('result', result)
				this.$router.push('/')
			} catch (error) {
				this.error = error.message
				console.error('error', error)
			}
		}
	}
}
</script>

<style lang="css" scoped>
.title {
	text-align: center;
}

.error {
	margin: 1rem 0 0;
	color: #ff4a96;
}
</style>
