const jwt = require('jsonwebtoken')
function createToken(user) {
    const payload = {
      sub: user.id,
      username: user.username,
      type: user.type,
      email: user.email
    }

    const secret = process.env.JWT_SECRET || 'keepitsecret,keepitsafe!'
  
    const options = {
      expiresIn: '1d'
    }
    return jwt.sign(payload, secret, options)
}

module.exports = createToken