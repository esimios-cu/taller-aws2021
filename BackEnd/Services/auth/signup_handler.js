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
		console.log('ERROR on Handler', _err)
		let err = utilitiesResponse.error(statusCode, _err)
		console.log('ERROR FORMAT->', err)
		return err
	}
}
