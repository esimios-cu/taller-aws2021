const { DynamoDBDocumentClient, QueryCommand, PutCommand } = require('@aws-sdk/lib-dynamodb')
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')

class Dynamo {
	constructor(region = 'us-east-1') {
		this.ddbClient = new DynamoDBClient({ region })
		const marshallOptions = {
			convertEmptyValues: false, //automatically convert empty strings, blobs, and sets to `null`. false, by default.
			removeUndefinedValues: false, // remove undefined values while marshalling. false, by default.
			convertClassInstanceToMap: false // convert typeof object to map attribute. false, by default.
		}
		const unmarshallOptions = {
			wrapNumbers: false // return numbers as a string instead of converting them to native JavaScript numbers. false, by default.
		}
		const translateConfig = { marshallOptions, unmarshallOptions }
		// Create the DynamoDB Document client.
		this.ddbDocClient = DynamoDBDocumentClient.from(this.ddbClient, translateConfig)
	}

	async query(tableName, params) {
		console.log('query-->', params, tableName)
		if (!params.ExpressionAttributeValues || !params.KeyConditionExpression || !tableName) {
			throw new Error('Valores incorrecto para realizar una consulta')
		}
		const paramsQuery = {
			// Define the expression attribute value, which are substitutes for the values you want to compare.
			ExpressionAttributeValues: { ...params.ExpressionAttributeValues },
			KeyConditionExpression: params.KeyConditionExpression,
			TableName: tableName
		}
		//KeyConditionExpression
		//ProjectionExpression: Set the values that are wanted
		//FilterExpressios: Specify which items in the results are returned.
		const extraParams = ['ProjectionExpression', 'FilterExpression']
		extraParams.forEach(extraParam => {
			if (params[extraParam]) {
				paramsQuery.ProjectionExpression = { ...params[extraParam] }
			}
		})
		console.log(`paramsQuery-->${JSON.stringify(paramsQuery)}`)
		try {
			const queryCommand = new QueryCommand(paramsQuery)
			console.log('queryCommand-->', queryCommand)
			const resultData = await this.ddbDocClient.send(queryCommand)
			return resultData.Items
		} catch (err) {
			console.log('error query--->', err)
			throw new Error('No es posible realizar esta consulta')
		}
	}

	async putItem(tableName, item) {
		try {
			console.log('putItem-->', tableName, JSON.stringify(item))
			if (!item) {
				throw new Error('Valores incorrectos para almacenar el elemento')
			}
			const paramsPutItem = {
				TableName: tableName,
				Item: { ...item }
			}
			const putCommand = new PutCommand(paramsPutItem)
			const resultPutItem = await this.ddbDocClient.send(putCommand)
			console.log('Elemento añadido correctamente')
			return resultPutItem
		} catch (err) {
			console.log('error putItem--->', err)
			throw new Error('No es posible realizar la inserción de este item')
		}
	}
}
module.exports.Dynamo = Dynamo
