const { CognitoIdentityProviderClient, SignUpCommand, InitiateAuthCommand, GetUserCommand } = require('@aws-sdk/client-cognito-identity-provider')

module.exports = {
	async signUp({ username, password, name }) {
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
	},

	async signIn({ username, password }) {
		const client = new CognitoIdentityProviderClient()
		const initiateAuthCommandInput = {
			AuthFlow: 'USER_PASSWORD_AUTH',
			ClientId: process.env.COGNITO_CLIENT_ID,
			AuthParameters: {
				USERNAME: username,
				PASSWORD: password
			}
		}
		console.log('initiateAuthCommandInput', initiateAuthCommandInput)
		const command = new InitiateAuthCommand(initiateAuthCommandInput)
		return await client.send(command)
	},

	async getUser({ accessToken }) {
		const client = new CognitoIdentityProviderClient()
		const getUserCommandInput = {
			AccessToken: accessToken
		}
		console.log('getUserCommandInput ->', getUserCommandInput)
		const command = new GetUserCommand(getUserCommandInput)
		return await client.send(command)
	}
}
