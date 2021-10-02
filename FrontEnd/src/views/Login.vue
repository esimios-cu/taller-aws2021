<template>
	<div class="h100 bgEsime">
		<h1 class="title">Iniciar sesión</h1>
		<form action class="form" @submit.prevent="doLogin">
			<label class="form-label" for="#email">Email:</label>
			<input class="form-input" v-model="email" type="email" id="email" required placeholder="Email" />
			<label class="form-label" for="#password">Contraseña:</label>
			<input class="form-input" v-model="password" type="password" id="password" placeholder="Password" />
			<label class="form-label" for="#verificationCode">Codigo de verificación:</label>
			<input class="form-input" v-model="verificationCode" type="number" id="verificationCode" placeholder="Código de verificación de email" />
			<sub>Agregar el código de verificación para validar su email</sub>
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
		verificationCode: '',
		error: ''
	}),
	methods: {
		toRegister() {
			this.$router.push('/register')
		},
		...mapActions(['login']),
		async doLogin() {
			const params = {
				'username': this.email,
				'password': this.password
			}
			if (this.verificationCode) {
				params.verificationCode = this.verificationCode
			}
			console.log('params', params)
			try {
				const result = await this.login(params)
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
sub {
	color: white;
}
</style>
