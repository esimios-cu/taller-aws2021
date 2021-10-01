const authentication = require('./modules/authentication')
const utilitiesResponse = require('./lib/utilitiesResponse')
const version = require('@aws-sdk/client-cognito-identity-provider/package.json').version

module.exports.handler = async (event, context) => {
	let statusCode = 500
	try {
		console.log('Event: ', event)
		console.log('Context: ', context)
		console.log('PKG Version: ', version)

		let body = {}
		if (event.body) {
			body = JSON.parse(event.body)
			console.log('Request body ->', body)
			if (!body.username || !body.password || !body.name) {
				statusCode = 400
				throw new Error('No se especificaron los datos del usuario')
			}
		} else {
			statusCode = 400
			throw new Error('No se especificó el cuerpo de la petición')
		}
		const user = {
			username: body.username,
			password: body.password,
			name: body.name
		}
		let signUpResponse = await authentication.signUp(user)
		console.log('signUpResponse ->', signUpResponse)
		return utilitiesResponse.success(201, {
			userConfirmed: signUpResponse.UserConfirmed,
			codeDeliveryDetails: signUpResponse.CodeDeliveryDetails,
			userSub: signUpResponse.UserSub
		})
	} catch (_err) {
		let err = _err
		console.log('ERROR on Handler', err)
		if (err.name && err.name == 'UsernameExistsException') {
			statusCode = 400
			err.message = 'El correo electrónico ya ha sido registrado previamente'
		}
		if (err.name && err.name == 'InvalidPasswordException') {
			statusCode = 400
			err.message = 'La contraseña no cumple con los requerimientos de seguridad'
		}
		let errResponse = utilitiesResponse.error(statusCode, err)
		console.log('ERROR RESPONSE->', errResponse)
		return errResponse
	}
}
