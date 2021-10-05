const main = require('./main.js')
const utilitiesResponse = require('./lib/utilitiesResponse')

exports.handler = async event => {
	let statusCode = 500
	try {		
		console.log('event-->', event)
		return await main.readPolygons(event)
	} catch (err) {
		console.log('Err-->', err)
		let errResponse = utilitiesResponse.error(statusCode, err)
		console.log('ERROR RESPONSE->', errResponse)
		return errResponse
	}
}
