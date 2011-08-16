require.paths.unshift('.')
var bingApi = require('bing-search-api')
var bing = new (bingApi.Bing)('<PUT YOUR BING APP KEY HERE>')


function logCallback(error, result) { 
	if (error) { console.error(error) }
	if (result) { console.info(result) }
}

bing.search('sushi', logCallback)