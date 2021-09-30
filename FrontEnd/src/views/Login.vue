<template>
	<div class="login">
		<h1 class="title">Iniciar sesión</h1>
		<form action class="form" @submit.prevent="login">
			<label class="form-label" for="#email">Email:</label>
			<input class="form-input" v-model="email" type="email" id="email" required placeholder="Email" />
			<label class="form-label" for="#password">Contraseña:</label>
			<input class="form-input" v-model="password" type="password" id="password" placeholder="Password" />
			<p v-if="error" class="error">Datos incorrectos, asegurese de que se encuentra registrado.</p>
			<input class="form-submit" type="submit" value="Login" />
		</form>
	</div>
</template>

<script>
export default {
	data: () => ({
		email: '',
		password: '',
		error: false
	}),
	methods: {
		login() {
			console.log(this.email)
			console.log(this.password)
		}
	}
}
</script>

<style lang="css" scoped>
.login {
	padding: 2rem;
}
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
.form-label:first-of-type {
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
