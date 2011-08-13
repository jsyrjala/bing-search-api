var http = require('http')
var url = require('url')
var _ = require('underscore')
var querystring = require('querystring')
var apiUrl = url.parse('http://api.search.live.net/json.aspx')


function Bing(appid) {
  this.appid = appid
}

Bing.prototype.search = function(query, callback, limit) {
  	var queryParams = {
      Appid: this.appid,
      query: query,
      sources : 'web',
      'web.count': (limit || 3),
	}
  var baseUrl = 'http://api.search.live.net/json.aspx?'
	var queryString = querystring.stringify(queryParams)
	try {
		makeQuery(apiUrl, queryString, function(error, data) {
      if(error) {
        callback(error)
      } else {
        var result = _(data).map(function( item ) {
          return {
            title: item.Title,
            url: linkify(item), 
            description: item.Description,
            dateTime: item.DateTime
            }
        })
        callback(null, result)
      }
    })
	} catch (e) {
		callback(e)
	}
}

function linkify(item) {
  var link = item.Url
  try {
    return url.parse(link)
  } catch(e) {
    try {
        return url.parse('http://' + link)
    } catch(e) {
      try {
        return url.parse(item.CacheUrl)
      } catch(e) {
        return null
      }
    }
  }
}

function QueryFailedException(statusCode) {
	this.statusCode = statusCode
}

function makeQuery(apiUrl, query, callback) {
	var path = apiUrl.pathname + '?' + query
	var requestParams = {
		host: apiUrl.host,
		path: path,
		method: 'GET',
		headers: {'User-agent': 'Node.js Bing search API/0.1' }
	}
  
	var req = http.request(requestParams, function(resp) {
		if(resp.statusCode == 200) {
      var message = ''
			resp.on('data', function(chunk) {
        message += chunk
			})
      resp.on('end', function()  {
        var json = JSON.parse(message)
        var results = json.SearchResponse.Web.Results || []
        callback(null, results)
      })
		} else {
			callback( new QueryFailedException(resp.statusCode))
		}
	});
	
	req.on('error', function(e) {
		callback(e)
	});
  
	req.end();
}


exports.Bing = Bing
