module.exports = {
	success: (statusCode, body) => {
		return {
			'statusCode': statusCode,
			'headers': {
				'Content-Type': 'application/json'
			},
			'isBase64Encoded': false,
			'body': JSON.stringify(body)
		}
	},

	error: (statusCode, error) => {
		return {
			'statusCode': statusCode,
			'headers': {
				'Content-Type': 'application/json'
			},
			'isBase64Encoded': false,
			'body': JSON.stringify({ message: error.message })
		}
	}
}
