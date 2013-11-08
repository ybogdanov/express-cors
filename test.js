var assert = require("assert"),
    expressCors = require('./index')

describe('express-cors', function(){

  describe('empty list of allowed origins', function(){
    var cors = expressCors({
      allowedOrigins: []
    })

    it('sould not match anything', function(){
      assert.ok(!match(cors, 'http://github.com'))
      assert.ok(!match(cors, 'https://google.com'))
    })
  })

  describe('origin with scheme specified', function(){
    var cors = expressCors({
      allowedOrigins: [
        'http://github.com',
        'https://google.com'
      ]
    })

    it('sould match correct scheme', function(){
      assert.ok(match(cors, 'http://github.com'))
      assert.ok(match(cors, 'https://google.com'))
    })

    it('sould not match incorrect scheme', function(){
      assert.ok(!match(cors, 'https://github.com'))
      assert.ok(!match(cors, 'http://google.com'))
    })

    it('sould not match with port', function(){
      assert.ok(!match(cors, 'https://github.com:80'))
      assert.ok(!match(cors, 'http://google.com:80'))
    })

    it('sould not match suffix-like hosts', function(){
      assert.ok(!match(cors, 'http://github.com.test'))
      assert.ok(!match(cors, 'https://github.com.test'))
    })

    it('sould not match prefix-like hosts', function(){
      assert.ok(!match(cors, 'http://testgithub.com'))
      assert.ok(!match(cors, 'https://testgithub.com'))
    })

    it('sould not match sub-level hosts', function(){
      assert.ok(!match(cors, 'http://test.github.com'))
      assert.ok(!match(cors, 'http://a.test.github.com'))
      assert.ok(!match(cors, 'https://test.github.com'))
      assert.ok(!match(cors, 'https://a.test.github.com'))
    })

    it('sould not match incorrect host', function(){
      assert.ok(!match(cors, 'http://microsoft.com'))
      assert.ok(!match(cors, 'http://'))
      assert.ok(!match(cors, 'https://microsoft.com'))
      assert.ok(!match(cors, 'https://'))
    })
  })

  describe('any scheme origin', function(){
    var cors = expressCors({
      allowedOrigins: [
        'github.com'
      ]
    })

    it('sould match any scheme', function(){
      assert.ok(match(cors, 'http://github.com'))
      assert.ok(match(cors, 'https://github.com'))
    })

    it('sould not match with port', function(){
      assert.ok(!match(cors, 'http://github.com:80'))
      assert.ok(!match(cors, 'https://github.com:80'))
    })

    it('sould not match sub-level hosts', function(){
      assert.ok(!match(cors, 'http://test.github.com'))
      assert.ok(!match(cors, 'http://a.test.github.com'))
      assert.ok(!match(cors, 'https://test.github.com'))
      assert.ok(!match(cors, 'https://a.test.github.com'))
    })

    it('sould not match incorrect host', function(){
      assert.ok(!match(cors, 'http://microsoft.com'))
      assert.ok(!match(cors, 'https://microsoft.com'))
      assert.ok(!match(cors, 'http://'))
      assert.ok(!match(cors, 'https://'))
    })
  })

  describe('wildcard host with scheme', function(){
    var cors = expressCors({
      allowedOrigins: [
        'https://*.github.com'
      ]
    })

    it('sould match given scheme', function(){
      assert.ok(match(cors, 'https://github.com'))
    })

    it('sould match given scheme with sub-level host', function(){
      assert.ok(match(cors, 'https://test.github.com'))
      assert.ok(match(cors, 'https://a.test.github.com'))
    })

    it('sould not match with port', function(){
      assert.ok(!match(cors, 'https://github.com:80'))
      assert.ok(!match(cors, 'https://test.github.com:80'))
    })

    it('sould not match incorrect scheme', function(){
      assert.ok(!match(cors, 'http://github.com'))
    })

    it('sould not match incorrect scheme with sub-level host', function(){
      assert.ok(!match(cors, 'http://test.github.com'))
    })

    it('sould not match suffix-like hosts', function(){
      assert.ok(!match(cors, 'http://github.com.test'))
      assert.ok(!match(cors, 'https://github.com.test'))
    })

    it('sould not match prefix-like hosts', function(){
      assert.ok(!match(cors, 'http://testgithub.com'))
      assert.ok(!match(cors, 'https://testgithub.com'))
    })

    it('sould not match incorrect host', function(){
      assert.ok(!match(cors, 'http://microsoft.com'))
      assert.ok(!match(cors, 'https://microsoft.com'))
      assert.ok(!match(cors, 'http://'))
      assert.ok(!match(cors, 'https://'))
    })
  })

  describe('wildcard host with any scheme', function(){
    var cors = expressCors({
      allowedOrigins: [
        '*.github.com'
      ]
    })

    it('sould match any scheme', function(){
      assert.ok(match(cors, 'https://github.com'))
      assert.ok(match(cors, 'http://github.com'))
    })

    it('sould match any scheme with sub-level host', function(){
      assert.ok(match(cors, 'https://test.github.com'))
      assert.ok(match(cors, 'http://test.github.com'))
      assert.ok(match(cors, 'https://a.test.github.com'))
      assert.ok(match(cors, 'http://a.test.github.com'))
    })

    it('sould not match with port', function(){
      assert.ok(!match(cors, 'https://github.com:80'))
      assert.ok(!match(cors, 'http://github.com:80'))
      assert.ok(!match(cors, 'https://test.github.com:80'))
      assert.ok(!match(cors, 'http://test.github.com:80'))
    })

    it('sould not match suffix-like hosts', function(){
      assert.ok(!match(cors, 'http://github.com.test'))
      assert.ok(!match(cors, 'https://github.com.test'))
    })

    it('sould not match prefix-like hosts', function(){
      assert.ok(!match(cors, 'http://testgithub.com'))
      assert.ok(!match(cors, 'https://testgithub.com'))
    })

    it('sould not match incorrect host', function(){
      assert.ok(!match(cors, 'http://microsoft.com'))
      assert.ok(!match(cors, 'https://microsoft.com'))
      assert.ok(!match(cors, 'http://'))
      assert.ok(!match(cors, 'https://'))
    })
  })

  describe('specified port with scheme', function(){
    var cors = expressCors({
      allowedOrigins: [
        'https://github.com:80'
      ]
    })

    it('sould match correct scheme and port', function(){
      assert.ok(match(cors, 'https://github.com:80'))
    })

    it('sould not match incorrect scheme', function(){
      assert.ok(!match(cors, 'http://github.com:80'))
    })

    it('sould not match incorrect port', function(){
      assert.ok(!match(cors, 'https://github.com:8080'))
    })

    it('sould not match without port', function(){
      assert.ok(!match(cors, 'https://github.com'))
    })

    it('sould not match suffix-like hosts', function(){
      assert.ok(!match(cors, 'https://github.com.test:80'))
    })

    it('sould not match prefix-like hosts', function(){
      assert.ok(!match(cors, 'https://testgithub.com:80'))
    })

    it('sould not match sub-level hosts', function(){
      assert.ok(!match(cors, 'https://test.github.com:80'))
    })

    it('sould not match incorrect host', function(){
      assert.ok(!match(cors, 'http://microsoft.com:80'))
      assert.ok(!match(cors, 'https://microsoft.com:80'))
    })
  })

  describe('any scheme with specified port', function(){
    var cors = expressCors({
      allowedOrigins: [
        'github.com:80'
      ]
    })

    it('sould match any scheme and port', function(){
      assert.ok(match(cors, 'https://github.com:80'))
      assert.ok(match(cors, 'http://github.com:80'))
    })

    it('sould not match incorrect port', function(){
      assert.ok(!match(cors, 'https://github.com:8080'))
      assert.ok(!match(cors, 'http://github.com:8080'))
    })

    it('sould not match without port', function(){
      assert.ok(!match(cors, 'https://github.com'))
      assert.ok(!match(cors, 'http://github.com'))
    })

    it('sould not match suffix-like hosts', function(){
      assert.ok(!match(cors, 'https://github.com.test:80'))
      assert.ok(!match(cors, 'http://github.com.test:80'))
    })

    it('sould not match prefix-like hosts', function(){
      assert.ok(!match(cors, 'https://testgithub.com:80'))
      assert.ok(!match(cors, 'http://testgithub.com:80'))
    })

    it('sould not match sub-level hosts', function(){
      assert.ok(!match(cors, 'https://test.github.com:80'))
      assert.ok(!match(cors, 'http://test.github.com:80'))
    })

    it('sould not match incorrect host', function(){
      assert.ok(!match(cors, 'http://microsoft.com:80'))
      assert.ok(!match(cors, 'https://microsoft.com:80'))
    })
  })

  describe('specified scheme with any port', function(){
    var cors = expressCors({
      allowedOrigins: [
        'https://github.com:*'
      ]
    })

    it('sould match correct scheme and without port', function(){
      assert.ok(match(cors, 'https://github.com'))
    })

    it('sould match correct scheme and any port', function(){
      assert.ok(match(cors, 'https://github.com:80'))
      assert.ok(match(cors, 'https://github.com:8080'))
    })

    it('sould not match incorrect scheme', function(){
      assert.ok(!match(cors, 'http://github.com'))
      assert.ok(!match(cors, 'http://github.com:8080'))
    })

    it('sould not match sub-level hosts', function(){
      assert.ok(!match(cors, 'https://test.github.com'))
      assert.ok(!match(cors, 'http://test.github.com'))
      assert.ok(!match(cors, 'https://test.github.com:80'))
      assert.ok(!match(cors, 'http://test.github.com:80'))
    })

    it('sould not match incorrect host', function(){
      assert.ok(!match(cors, 'http://microsoft.com'))
      assert.ok(!match(cors, 'https://microsoft.com'))
      assert.ok(!match(cors, 'http://microsoft.com:80'))
      assert.ok(!match(cors, 'https://microsoft.com:80'))
    })
  })

  describe('any scheme with any port', function(){
    var cors = expressCors({
      allowedOrigins: [
        'github.com:*'
      ]
    })

    it('sould match any scheme and without port', function(){
      assert.ok(match(cors, 'https://github.com'))
      assert.ok(match(cors, 'http://github.com'))
    })

    it('sould match any scheme and any port', function(){
      assert.ok(match(cors, 'http://github.com:80'))
      assert.ok(match(cors, 'http://github.com:8080'))
      assert.ok(match(cors, 'https://github.com:80'))
      assert.ok(match(cors, 'https://github.com:8080'))
    })

    it('sould not match sub-level hosts', function(){
      assert.ok(!match(cors, 'https://test.github.com'))
      assert.ok(!match(cors, 'http://test.github.com'))
      assert.ok(!match(cors, 'https://test.github.com:80'))
      assert.ok(!match(cors, 'http://test.github.com:80'))
    })

    it('sould not match incorrect host', function(){
      assert.ok(!match(cors, 'http://microsoft.com'))
      assert.ok(!match(cors, 'https://microsoft.com'))
      assert.ok(!match(cors, 'http://microsoft.com:80'))
      assert.ok(!match(cors, 'https://microsoft.com:80'))
    })
  })

  describe('wildcard host with any scheme and any port', function(){
    var cors = expressCors({
      allowedOrigins: [
        '*.github.com:*'
      ]
    })

    it('sould match any scheme and without port', function(){
      assert.ok(match(cors, 'https://github.com'))
      assert.ok(match(cors, 'http://github.com'))
    })

    it('sould match any sub-level host with any scheme and without port', function(){
      assert.ok(match(cors, 'https://test.github.com'))
      assert.ok(match(cors, 'http://test.github.com'))
      assert.ok(match(cors, 'https://a.test.github.com'))
      assert.ok(match(cors, 'http://a.test.github.com'))
    })

    it('sould match any scheme and any port', function(){
      assert.ok(match(cors, 'http://github.com:80'))
      assert.ok(match(cors, 'http://github.com:8080'))
      assert.ok(match(cors, 'https://github.com:80'))
      assert.ok(match(cors, 'https://github.com:8080'))
    })

    it('sould match any sub-level host and any scheme and any port', function(){
      assert.ok(match(cors, 'http://test.github.com:80'))
      assert.ok(match(cors, 'http://test.github.com:8080'))
      assert.ok(match(cors, 'https://test.github.com:80'))
      assert.ok(match(cors, 'https://test.github.com:8080'))
    })

    it('sould not match incorrect host', function(){
      assert.ok(!match(cors, 'http://microsoft.com'))
      assert.ok(!match(cors, 'https://microsoft.com'))
      assert.ok(!match(cors, 'http://microsoft.com:80'))
      assert.ok(!match(cors, 'https://microsoft.com:80'))
    })
  })
  
  describe('OPTIONS http request', function(){
    it('should send http 200', function(){
      var cors = expressCors({
        allowedOrigins: [
          'https://github.com'
        ]
      })

      var req = mockReqRes({Origin: 'https://github.com'}),
          res = mockReqRes(),
          next = function(){}

      req.method = 'OPTIONS'

      cors(req, res, next)

      assert.equal(200, res.sentCode)
    })
  })

  describe('Access-Control-Allow-Methods', function(){

    it('should be by default', function(){
      var cors = expressCors({
        allowedOrigins: [
          'https://github.com'
        ]
      })

      var headers = matchHeaders(cors, 'https://github.com')

      assert.equal('GET, POST, PUT, DELETE, PATCH, OPTIONS', headers['Access-Control-Allow-Methods'])
    })

    it('should give anything we want', function(){
      var cors = expressCors({
        allowedOrigins: [
          'https://github.com'
        ],
        methods: [
          'GET', 'POST', 'PUT', 'DELETE'
        ]
      })

      var headers = matchHeaders(cors, 'https://github.com')

      assert.equal('GET, POST, PUT, DELETE', headers['Access-Control-Allow-Methods'])
    })

    it('should not give anything for empty list', function(){
      var cors = expressCors({
        allowedOrigins: [
          'https://github.com'
        ],
        methods: []
      })

      var headers = matchHeaders(cors, 'https://github.com')

      assert.equal(undefined, headers['Access-Control-Allow-Methods'])
    })
  })

  describe('Access-Control-Allow-Headers', function(){

    it('should be X-Requested-With,Content-Type by default', function(){
      var cors = expressCors({
        allowedOrigins: [
          'https://github.com'
        ]
      })

      var headers = matchHeaders(cors, 'https://github.com')

      assert.equal('X-Requested-With, Content-Type', headers['Access-Control-Allow-Headers'])
    })

    it('should give anything we want', function(){
      var cors = expressCors({
        allowedOrigins: [
          'https://github.com'
        ],
        headers: [
          'X-HTTP-Method-Override', 'Content-Type', 'Accept'
        ]
      })

      var headers = matchHeaders(cors, 'https://github.com')

      assert.equal('X-HTTP-Method-Override, Content-Type, Accept', headers['Access-Control-Allow-Headers'])
    })

    it('should not give anything for empty list', function(){
      var cors = expressCors({
        allowedOrigins: [
          'https://github.com'
        ],
        headers: []
      })

      var headers = matchHeaders(cors, 'https://github.com')

      assert.equal(undefined, headers['Access-Control-Allow-Headers'])
    })
  })

  describe('Access-Control-Max-Age', function(){

    it('should not be by default', function(){
      var cors = expressCors({
        allowedOrigins: [
          'https://github.com'
        ]
      })

      var headers = matchHeaders(cors, 'https://github.com')

      assert.equal(undefined, headers['Access-Control-Max-Age'])
    })

    it('should give anything we want', function(){
      var cors = expressCors({
        allowedOrigins: [
          'https://github.com'
        ],
        maxAge: 3600
      })

      var headers = matchHeaders(cors, 'https://github.com')

      assert.equal(3600, headers['Access-Control-Max-Age'])
    })
  })

  describe('Access-Control-Allow-Credentials', function(){

    it('should be "true" by default', function(){
      var cors = expressCors({
        allowedOrigins: [
          'https://github.com'
        ]
      })

      var headers = matchHeaders(cors, 'https://github.com')

      assert.equal('true', headers['Access-Control-Allow-Credentials'])
    })

    it('should be able to set to "false"', function(){
      var cors = expressCors({
        allowedOrigins: [
          'https://github.com'
        ],
        allowCredentials: false
      })

      var headers = matchHeaders(cors, 'https://github.com')

      assert.equal(undefined, headers['Access-Control-Allow-Credentials'])
    })
  })
})

function match(cors, origin) {
  var headers = matchHeaders(cors, origin)
  return headers['Access-Control-Allow-Origin'] === origin
}

function matchHeaders(cors, origin) {
  var req = mockReqRes({Origin: origin}),
      res = mockReqRes(),
      next = function(){}
  cors(req, res, next)
  return res.vars
}

function mockReqRes(vars) {
  var obj = {
    vars: vars || {},
    sentCode: null,
    get: function(name) {
      return obj.vars[name]
    },
    set: function(name, value) {
      obj.vars[name] = value
    },
    send: function(code) {
      obj.sentCode = code
    }
  }
  return obj
}
