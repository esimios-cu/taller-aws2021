<template>
	<div class="h100" id="app">
		<router-view />
	</div>
</template>

<style>
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
	height: 100%; /*both html and body*/
}
body {
	margin: 0; /*reset default margin*/
}
.h100 {
	height: 100%;
}
.w100 {
	height: 100%;
}
</style>
