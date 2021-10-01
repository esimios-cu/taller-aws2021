const { CognitoIdentityProviderClient, SignUpCommand } = require('@aws-sdk/client-cognito-identity-provider')

module.exports = {
	async cognitoSignUp({ username, password, name }) {
		const client = new CognitoIdentityProviderClient()
		const signUpCommandInput = {
			ClientId: process.env.COGNITO_CLIENT_ID,
			Username: username,
			Password: password,
			UserAttributes: [
				{
					Name: 'name',
					Value: name
				}
			]
		}
		console.log('signUpCommandInput', signUpCommandInput)
		const command = new SignUpCommand(signUpCommandInput)
		return await client.send(command)
	}
}
