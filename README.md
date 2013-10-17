# express-cors
Simple middleware for adding [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing) functionality to your [expressjs](http://expressjs.com/) app.

### Installation

	npm install express-cors

### Usage
	
```javascript
var cors = require('express-cors')

app.use(cors({
	allowedOrigins: [
		'github.com', 'google.com'
	]
}))
```

	curl -v -H "Origin: https://github.com" http://localhost:3000/

…

	HTTP/1.1 200 OK
	X-Powered-By: Express
	Access-Control-Allow-Origin: https://github.com
	Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
	Access-Control-Allow-Headers: X-Requested-With, Content-Type

### Possible hosts specification

* ```https://github.com``` - allow only https scheme for this host
* ```http://github.com``` - allow only http scheme for this host
* ```github.com``` - allow any scheme for this host
* ```*.github.com``` - allow any sub-domain including second-level domain itself
* ```https://*.github.com``` - same as above but restrict for https only
* ```github.com:*``` - allow any port for this host
* ```*.github.com:*``` - allow any port for this host and any sub-domain
* ```https://*.github.com:*``` - same as above but restrict for https only

You've got the idea… If not, see [test.js](https://github.com/0ctave/express-cors/blob/master/test.js) for more examples.

### Other options

* `methods` - array of allowed methods (default value is `GET, POST, PUT, DELETE, PATCH, OPTIONS`)
* `headers` - array of allowed headers (default value is `X-Requested-With, Content-Type`)
* `maxAge` - value for `Access-Control-Allow-Max-Age` header (default is `none`)

# Running Tests

	mocha -R spec
	
If you want to contribute please ensure all tests are passing.

# License
(The MIT License)

Copyright 2013 by Yuriy Bogdanov \<chinsay gmail\>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
