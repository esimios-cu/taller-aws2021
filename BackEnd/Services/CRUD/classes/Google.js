const { SecretsManager } = require('./SecretManager.js')
const https = require('https')

class Google {
	constructor() {
		this.apiKey = ''
	}
	async reverseGeocoding(point) {
		return new Promise(async (resolve,reject)=>{
			try {
				if (!this.apiKey) {
					this.apiKey = await new SecretsManager().getSecret(process.env.GOOGLE_SECRET)
				}
				if (!(point.lat && point.lng)) {
					throw new Error('Valores insuficientes para obtener la información de los puntos')
				}
				const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${point.lat},${point.lng}&key=${this.apiKey}`
				https
					.get(url, res => {
						let data = []
	
						res.on('data', chunk => {
							data.push(chunk)
						})
						res.on('end', () => {
							const result = JSON.parse(Buffer.concat(data).toString())
							if ((result.status = 'OK')) {
								if (result.results[0]) {
									resolve(result.results[0].formatted_address)
								} else {
									resolve('SIN DIRECCIÓN')
								}
							} else {
								resolve('SIN DIRECCIÓN')
							}
						})
					})
					.on('error', err => {
						console.log('Error reverseGeocoding: ', err.message)
						throw new Error('Ocurrió un error al solicitar la información del punto')
					})
			} catch (err) {
				console.log('err-->', err)
				throw new Error('Ocurrió un error al solicitar las direcciones de los puntos')
			}
		})
	
	}
}

module.exports.Google = Google
