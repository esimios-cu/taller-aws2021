const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager')

class SecretsManager {
	constructor(region = 'us-east-1') {
		this.client = new SecretsManagerClient({ region })
	}
	async getSecret(secretName) {
		try {
			const command = new GetSecretValueCommand({ SecretId: secretName })
			const response = await this.client.send(command)
			for (let key in response) {
				if (key === 'SecretString') {
					return response[key]
				}
			}
			throw new Error('El secreto no fue encontrado')
		} catch (err) {
			console.log('err-->', err)
			throw new Error('Ocurrió un error al obterner el secreto')
		}
	}
}

module.exports.SecretsManager = SecretsManager
