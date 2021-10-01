const authentication = require('./modules/authentication')
const utilitiesResponse = require('./lib/utilitiesResponse')

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
		return utilitiesResponse.success(200, {
			accessToken: signInResponse.AuthenticationResult.AccessToken,
			expiresIn: signInResponse.AuthenticationResult.ExpiresIn,
			tokenType: signInResponse.AuthenticationResult.TokenType,
			refreshToken: signInResponse.AuthenticationResult.RefreshToken,
			idToken: signInResponse.AuthenticationResult.IdToken
		})
	} catch (_err) {
		console.log('ERROR on Handler', _err)
		let err = utilitiesResponse.error(statusCode, _err)
		console.log('ERROR FORMAT->', err)
		return err
	}
}
