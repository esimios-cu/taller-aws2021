class Utils {
	static getUserIdFromToken(b64Token) {
		try {
			console.log('getUserIdFromToken')
			if (!b64Token) {
				return false
			}
			const jwt = b64Token.split('.').map(part => Buffer.from(part, 'base64').toString('utf-8'))
			const payload = JSON.parse(jwt[1])
			console.log(payload)
			const userId = payload.username
			if (!userId) {
				return false
			}
			return userId
		} catch (err) {
			console.log('err--->', err)
			return false
		}
	}
}
module.exports.Utils = Utils
