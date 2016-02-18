var jwt = require('jwt-simple');

// Login/ Signup helper to authenticate user
// Creates a token with secret. Clients must use interceptor to attach tokens to requests
exports.createToken = function(request, response, user_id){
  var payload = {'user_id': user_id};
  var secret = process.env.jwtsecret || require('./config.js').jwtsecret;

  // Encoding
  var token = jwt.encode(payload, secret);
  response.set('token', token).status(201).json({token: token});
};

// Custom Auth middleware
exports.checkToken = function(request, response, next){
  var secret = process.env.jwtsecret || require('./config.js').jwtsecret;

  // Check if token exists
  if(!request.headers['x-access-token']) {
    response.sendStatus(401);

  } else {
    // Decoding
    // If the token exists, attribute actions to the decoded user
    // App will break if tokens are invalid!
                                  // TODO: Add a timeout to the token
    var decodedToken = jwt.decode(request.headers['x-access-token'], secret);
    request.user = {};
    request.user.id = decodedToken.user_id;
    next();
  }
};
