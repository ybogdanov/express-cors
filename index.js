/**
 * CORS middleware for expressjs
 * Copyright 2013 by Yuriy Bogdanov <chinsay gmail>
 *
 * (MIT LICENSE)
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

module.exports = function(options) {

  options = options || {};
  if (!options.hasOwnProperty('allowCredentials')) {
    options.allowCredentials = true;
  }
  options.methods = options.methods || ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];
  options.headers = options.headers || ['X-Requested-With', 'Content-Type'];

  //verify if any origin allowed
  if (options.allowedOrigins === '*') options.allowedOrigins = true;

  // if string provided as allowed origins, convert to single element array
  if (typeof options.allowedOrigins === 'string') options.allowedOrigins = [options.allowedOrigins];

  var originMatch = false;
  if (options.allowedOrigins === true) {
    //match all origins
    originMatch = true;
  }
  else {
    // Parse allowed origins list and turn them all into regexps if needed
    var allowedOriginsRegexps = [];
    var allowedOriginsStrings = options.allowedOrigins.filter(function(origin){
      // check if allowed origin starts with http:// or https://
      // if not, then we should allow both
      var anyHttp = !origin.match(/^https?:\/\//);
      // random hash tokens to escape wildcard sequences like "*." and ":*"
      var rand = 'WnqkQwirtbRoerjaSnei20ssbqQi',
          rand1 = rand + '1',
          rand2 = rand + '2';
      // to detect if regexp is needed store original origin
      var original_origin = origin;
      // hide wildcard sequences
      origin = origin.replace(/\*\./g, rand1);
      origin = origin.replace(/:\*/g, rand2);
      if (!anyHttp && (original_origin === origin)) {
        //there was strict requirement for protocol
        //and no one wildcard sequence so
        //regexp is not needed = keep as string
        return true;
      }
      // escape wildcard regexp characters in origin value
      origin = escapeRegExp(origin);
      // return wildcard sequences back, turning them into reg expressions
      origin = origin.replace(new RegExp(rand1, 'g'), '(.*\\.)?');
      origin = origin.replace(new RegExp(rand2, 'g'), '(:\\d+)?');
      // append http/https expression if we allow both
      if (anyHttp) {
        origin = '^https?:\/\/' + origin + '$';
      }
      else {
        origin = '^' + origin + '$';
      }
      allowedOriginsRegexps.push(new RegExp(origin));
      return false; //remove from strings
    });
    if (allowedOriginsStrings.length || allowedOriginsRegexps.length) {
//console.log('allowedOriginsStrings: ' + allowedOriginsStrings);
//console.log('allowedOriginsRegexps.length: ' + allowedOriginsRegexps.length);
      originMatch = function (origin) {
        var matched = (allowedOriginsStrings.indexOf(origin) >= 0);
        if (!matched) {
          // match against all prepared regexp origins
          for (i = 0; i < allowedOriginsRegexps.length; ++i) {
            if (allowedOriginsRegexps[i].test(origin)) {
              matched = true;
              break;
            }
          }
        }
        return matched;
      };
    }
  }

  //prepare ready to use headers if arrays of strings provided in options
  options.methods && (options.methods.join) && (options.methods = options.methods.join(', '));
  options.headers && (options.headers.join) && (options.headers = options.headers.join(', '));

//console.log('originMatch: ' + (originMatch === false ? 'false' : (originMatch === true ? 'true' : 'find on lists')));
//console.log('options.methods: ' + options.methods);
//console.log('options.headers: ' + options.headers);

  // express middleware
  return !originMatch ?
    //match is impossible - always skip CORS processing
    function (req, res, next) {
//console.log('match is impossible - skip CORS processing');
      next();
    } :
    //middleware with verification if there is a match of origin
    function(req, res, next) {
      var origin = req.get('Origin');
//console.log('Origin: ' + origin);
      if (!origin || ((originMatch !== true) && !originMatch(origin))) {
//console.log('Origin not matched');
        //request without Origin header or origin not matched - skip CORS processing
        return next();
      }
      res.set('Access-Control-Allow-Origin', origin);

      if (options.methods) {
//console.log('adding methods');
        res.set(
          'Access-Control-Allow-Methods',
          options.methods === true ? //verify if all methods are allowed
              req.get('Access-Control-Request-Method') : //return requested method
              options.methods //comma separated list of methods
        );
      }

      if (options.headers) {
//console.log('adding headers');
        res.set(
          'Access-Control-Allow-Headers',
          options.headers === true ? //verify if all headers are allowed
            req.get('Access-Control-Request-Headers') : //return requested header
            options.headers //comma separated list of headers
        );
      }

      if (options.maxAge) {
//console.log('adding maxAge: ' + options.maxAge);
        res.set('Access-Control-Max-Age', options.maxAge);
      }

      if (options.allowCredentials) {
//console.log('adding credentials: true');
        res.set('Access-Control-Allow-Credentials', 'true');
      }

      if ('OPTIONS' == req.method) {
//console.log('OPTIONS method detected - send response 200 without further processing');
        return res.send(200);
      }

//console.log('CORS processing done, execute standard request processing');
      next();
    };
};

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};
