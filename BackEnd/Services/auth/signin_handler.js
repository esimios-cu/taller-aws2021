const authentication = require('./modules/authentication')
const utilitiesResponse = require('./lib/utilitiesResponse')
const { NotAuthorizedException } = require('@aws-sdk/client-cognito-identity-provider')

module.exports.handler = async (event, context) => {
	let statusCode = 500
	try {
		console.log('Event: ', event)
		console.log('Context: ', context)

		let body = {}
		if (event.body) {
			body = JSON.parse(event.body)
			console.log('Request body ->', body)
			if (!body.username || !body.password) {
				statusCode = 400
				throw new Error('No se especificaron las credenciales')
			}
		} else {
			statusCode = 400
			throw new Error('No se especificó el cuerpo de la petición')
		}
		const userCredentials = {
			username: body.username,
			password: body.password
		}
		let signInResponse = await authentication.signIn(userCredentials)
		console.log('signInResponse ->', signInResponse)

		let getUserResponse = await authentication.getUser({
			accessToken: signInResponse.AuthenticationResult.AccessToken
		})
		console.log('getUserResponse ->', getUserResponse)
		const userName = getUserResponse.UserAttributes.find(attr => attr.Name === 'name')
		if (!userName) {
			statusCode = 500
			throw new Error('Ocurrio un error al recuperar los datos del usuario')
		}

		return utilitiesResponse.success(200, {
			accessToken: signInResponse.AuthenticationResult.AccessToken,
			expiresIn: signInResponse.AuthenticationResult.ExpiresIn,
			tokenType: signInResponse.AuthenticationResult.TokenType,
			refreshToken: signInResponse.AuthenticationResult.RefreshToken,
			idToken: signInResponse.AuthenticationResult.IdToken,
			name: userName.Value
		})
	} catch (_err) {
		let err = _err
		console.log('ERROR on Handler', err)
		if (err.name && err.name == 'NotAuthorizedException') {
			statusCode = 400
			err.message = 'El usuario o contraseña son incorrectos'
		}
		if (err.name && err.name == 'UserNotFoundException') {
			statusCode = 400
			err.message = 'La cuenta especificada no existe'
		}
		if (err.name && err.name == 'UserNotConfirmedException') {
			statusCode = 400
			err.message = 'No sea ha confirmado el correo electrónico'
		}
		let errResponse = utilitiesResponse.error(statusCode, err)
		console.log('ERROR RESPONSE->', errResponse)
		return errResponse
	}
}
