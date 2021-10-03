<template>
	<div class="h100 bgEsime">
		<h1 class="title">Sign Up</h1>
		<form action class="form" @submit.prevent="doRegister">
			<label class="form-label" for="#email">Email:</label>
			<input :disabled="loaders.doingRegister" v-model="email" class="form-input" type="email" id="email" required placeholder="Email" />
			<label class="form-label" for="#name">Nombre:</label>
			<input :disabled="loaders.doingRegister" v-model="name" class="form-input" type="text" id="name" required placeholder="Nombre" />
			<label class="form-label" for="#password">Contraseña:</label>
			<input :disabled="loaders.doingRegister" v-model="password" class="form-input" type="password" id="password" placeholder="Password" />
			<label class="form-label" for="#password-repeat">Repite la contraeña:</label>
			<input :disabled="loaders.doingRegister" v-model="passwordRepeat" class="form-input" type="password" id="password-repeat" placeholder="Password" />
			<p v-if="error" class="error">{{ error }}</p>
			<pulse-loader class="m10" v-if="loaders.doingRegister"></pulse-loader>
			<input v-show="!loaders.doingRegister" class="form-submit" type="submit" value="Sign Up" />
			<div class="bottomLink"><a href="#" @click="toLogin">Login</a></div>
		</form>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
	name: 'Register',
	components: {
		PulseLoader
	},
	data: () => ({
		email: '',
		name: '',
		password: '',
		passwordRepeat: '',
		error: '',
		loaders: {
			doingRegister: false
		}
	}),
	methods: {
		...mapActions(['register']),
		toLogin() {
			this.$router.push('/login')
		},
		async doRegister() {
			if (this.password != this.passwordRepeat) {
				this.error = 'Las contraseñas no coinciden'
				throw 'Las contraseñas no coinciden'
			}
			this.error = ''
			this.loaders.doingRegister = true
			const paramas = {
				'username': this.email,
				'password': this.password,
				'name': this.name
			}
			try {
				const result = await this.register(paramas)
				console.log('result', result)
				this.$router.push('/login')
			} catch (error) {
				this.error = error.message
				console.error('error', error)
			} finally {
				this.loaders.doingRegister = false
			}
		}
	}
}
</script>

<style lang="css" scoped>
.title {
	text-align: center;
}
.form {
	margin: 3rem auto;
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 20%;
	min-width: 350px;
	max-width: 100%;
	background: rgba(19, 35, 47, 0.9);
	border-radius: 5px;
	padding: 40px;
	box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.3);
}
.form-label {
	margin-top: 2rem;
	color: white;
	margin-bottom: 0.5rem;
}

.form-label :first-of-type {
	margin-top: 0rem;
}
.form-input {
	padding: 10px 15px;
	background: none;
	background-image: none;
	border: 1px solid white;
	color: white;
}
.form-input:focus {
	outline: 0;
	border-color: #1ab188;
}
.form-submit {
	background: #1ab188;
	border: none;
	color: white;
	margin-top: 3rem;
	padding: 1rem 0;
	cursor: pointer;
	transition: background 0.2s;
}
.form-submit:hover {
	background: #0b9185;
}

.error {
	margin: 1rem 0 0;
	color: #ff4a96;
}
</style>
