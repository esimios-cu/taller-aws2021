const { Dynamo } = require('./classes/Dynamo.js')
const { Utils } = require('./classes/Utils.js')
const utilitiesResponse = require('./lib/utilitiesResponse')

const main = {
	globalUserId: 'globals',
	async readPolygons(event) {
		//1. Validar que venga el token
		//2. Leer el registro de Dynamo
		//3. Regresarlos
		try {
			console.log('this-->', this)
			console.log('readPolygons')
			if (event.headers && event.headers['authorization']) {
				const token = event.headers['authorization']
				const userId = Utils.getUserIdFromToken(token)
				if (userId) {
					const dynamo = new Dynamo()
					const globalPolygons = await main.readDynamoPolygons(dynamo)
					const userPolygons = await main.readDynamoPolygons(dynamo, userId)
					return utilitiesResponse.success(200, { code: 1, message: 'Poligonos obtenidos correctamente', data: { globalPolygons, userPolygons } })
				} else {
					throw new Error('El token obtenido no es correcto')
				}
			} else {
				throw new Error('No se añadió el cuerpo de la petición')
			}
		} catch (err) {
			console.log('err--->', err)
			throw new Error('Ha ocurrido un error al leer los polígonos')
		}
	},
	async readDynamoPolygons(dynamo, userId = 'globals') {
		try {
			console.log('readGlobalsPolygons')
			const tableName = 'Polygons'
			const params = {
				ExpressionAttributeNames: {
					'userId': 'hash_key'
				},
				ExpressionAttributeValues: {
					':userId': userId
				},
				KeyConditionExpression: 'userId = :userId'
			}
			const resultDynamoQuery = await dynamo.query(tableName, params)
			return resultDynamoQuery
		} catch (err) {
			console.log('ERR-->', err)
			throw new Error('Error al leer los polígonos globales')
		}
	}
}

exports.readPolygons = main.readPolygons
