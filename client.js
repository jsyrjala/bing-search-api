require.paths.unshift('.')
var bingApi = require('bing-search-api')
var bing = new (bingApi.Bing)('E592371E37205F15516092874A03D7F4C3C188CD')


function logCallback(error, result) { 
	if (error) { console.error(error) }
	if (result) { console.info(result) }
}

bing.search('sushi', logCallback)