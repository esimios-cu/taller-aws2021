const { Google } = require('./classes/Google.js')
const { Dynamo } = require('./classes/Dynamo.js')
const { Utils } = require('./classes/Utils.js')
const utilitiesResponse = require('./lib/utilitiesResponse')

const main = {
	globalUserId: 'globals',
	async createPolygon(event, context) {
		//1. Validar que venga el token
		//2. Sacar la información de los puntos de google
		//3. Guardar la información del polígono
		try {
			if (event.body && event.headers && event.headers['authorization']) {
				console.log('event.body-->', event.body)
				const body = JSON.parse(event.body)
				const token = event.headers['authorization']
				let userId = Utils.getUserIdFromToken(token)
				console.log('userId-->', userId)
				const name = body.name
				const polygon = body.polygon
				console.log('name-->', name)
				console.log('polygon-->', polygon)
				if (userId && polygon instanceof Array && name) {
					userId = body.typePolygon === 'private' ? userId : main.globalUserId
					const dynamo = new Dynamo()
					for (let point of polygon) {
						const infoPoint = await main.getPointInfoFromGoogle(point)
						point.infoPoint = infoPoint
					}
					await main.insertPolygon(userId, polygon, name, dynamo)
					return utilitiesResponse.success(200, { code: 1, message: 'Polígono insertado correctamente' })
				} else {
					throw new Error('El token obtenido no es correcto')
				}
			} else {
				throw new Error('No se añadió el cuerpo de la petición')
			}
		} catch (err) {
			console.log('err--->', err)
			throw new Error('Ocurrió un error al crear el polígono')
		}
	},
	async insertPolygon(userId, polygon, name, dynamo) {
		try {
			console.log('insertPolygon')
			const tableName = 'Polygons'
			const item = {
				userId: userId,
				timestamp: new Date().getTime(),
				polygon: polygon,
				name: name
			}
			const resultDynamoQuery = await dynamo.putItem(tableName, item)
			return resultDynamoQuery
		} catch (err) {
			console.log('ERR-->', err)
			throw new Error('Error al generar el polígono')
		}
	},
	async getPointInfoFromGoogle(point) {
		try {
			const google = new Google()
			return await google.reverseGeocoding(point)
		} catch (err) {
			console.log('err-->', err)
			throw new Error('Ocurrió un error al solicitar la información del punto a Google')
		}
	}
}

exports.createPolygon = main.createPolygon
