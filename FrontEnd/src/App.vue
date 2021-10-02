<template>
	<div class="h100" id="app">
		<router-view />
	</div>
</template>

<style>
*,
html,
body {
	margin: 0;
	padding: 0;
}
.m10 {
	margin: 10px;
}
.p10 {
	margin: 10px;
}
.error {
	margin: 1rem 0 0;
	color: #ff4a96;
}
.bgRed {
	background-color: red;
}
.bgEsime {
	background-image: url('/assets/fondo.jpeg');
	background-position: center;
	background-size: cover;
	background-repeat: no-repeat;
}
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

#nav {
	padding: 30px;
}

#nav a {
	font-weight: bold;
	color: #2c3e50;
}

#nav a.router-link-exact-active {
	color: #42b983;
}
html,
body {
	margin: 0; /*reset default margin*/
	height: 100%; /*both html and body*/
}
.h100 {
	height: 100%;
}
.w100 {
	height: 100%;
}
a {
	color: white;
}
.bottomLink {
	text-align: right;
	padding-top: 10px;
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

.text-right {
	text-align: right;
}
.text-center {
	text-align: center;
}
</style>
