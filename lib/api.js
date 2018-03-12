
const request = require('request')
const apiRoot = `https://api.dialogflow.com/v1`

const methods = ['post', 'put', 'get', 'delete']
const devTypes = ['intents', 'entities']
const clientTypes = ['query', 'userEntities', 'contexts']
const types = devTypes.concat(clientTypes)

var devToken, clientToken

/** Set the development token */
const setDevToken = (token) => devToken = token

/** Set the client token */
const setClientToken = (token) => clientToken = token

/**
 * Set the appropriate token, depending on endpoint type
 * @param {string} type - endpoint type
 * @param {string} token - access token to use
 */
const setTokenByType = (type, token) => {
    if(devTypes.indexOf(type) !== -1){
        devToken = token
    }else{
        clientToken = token
    }
}

/**
 * @param {string} operation - REST method to use (get, post, put, delete)
 * @param {string} type - endpoint to use (intents, entities, query, entities, userEntities)
 * @param {Object} options - Object containing id for targeting individual objects, and payload (json) for post / put operations
 */
const run = (operation, type, options = {}) => {
	if(methods.indexOf(operation) === -1){
		throw Error(operation + ' is not an accepted method')
    }
    
	if(types.indexOf(type) === -1){
		throw Error(type + ' is not an accepted type')
    }

    let token = devTypes.indexOf(type) !== -1 ? devToken : clientToken
    if(token === undefined) {
        throw Error('Missing access token')
    }

	let opts = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		json: true,
	}

    if(options.payload) {
		opts.body = options.payload
		if(typeof options.payload !== 'object'){
			throw Error('payload must be an object or array')
		}
	}

	// console.log(opts)
	
	let endpoint = `${apiRoot}/${type}`
    if(options.id) endpoint += '/' + options.id
	endpoint += '?v=20150910'

	// TODO: ensure this format will work for client endpoints
        
	return new Promise((resolve, reject) => {
		request[operation](endpoint, opts, 
			(err, res, body) => {
				if(err) return reject(err)
				// if(body === undefined) reject(res.statusMessage)
				if(body.status && body.status.code !== 200){
					reject(body)
				}else {
					resolve(body)
				}
			}
		)
	})
}

module.exports = {
    run,
    setClientToken,
    setDevToken,
    setTokenByType,
    get(type, options){ return run('get', type, options) },
    put(type, options){ return run('put', type, options) },
    post(type, options){ return run('post', type, options) },
    delete(type, options){ return run('delete', type, options) },
}
