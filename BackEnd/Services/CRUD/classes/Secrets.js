const { SecretsManagerClient } = require('@aws-sdk/client-secrets-manager')

class Secrets {
	constructor(region = 'us-east-1') {
		this.client = new SecretsManagerClient({ region })
	}
	async getSecret(secretName) {
		const command = new GetSecretValueCommand(secretName)
		const response = await this.client.send(command)
		return response
	}
}

export default Secrets
