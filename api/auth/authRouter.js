const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = require('express').Router()

const Users = require('./authModel')

router.post('/register', (req, res) => {
  // implement registration
  const credentials = req.body

  if (isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 8

    // hash the password
    const hash = bcryptjs.hashSync(credentials.password, rounds)

    credentials.password = hash
    // save the user to the database
    Users.add(credentials)
      .then(user => {
        // client now gets a token after registering
        const token = createToken(user)
        res.status(201).json({ data: user, token })
      })
      .catch(error => {
        res.status(500).json({ message: error.message })
      })
  } else {
    res.status(400).json({
      message: 'Please provide username and password and the password shoud be alphanumeric.',
    })
  }
})

router.post('/login', (req, res) => {
  // implement login
  const { username, password } = req.body

  if (isValid(req.body)) {
    Users.findBy({ username })
      .then(([user]) => {
        // compare the password the hash stored in the database
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = createToken(user)

          res.status(200).json({ message: `Welcome to our API ${username}`, token })
        } else {
          res.status(401).json({ message: 'Invalid credentials' })
        }
      })
      .catch(error => {
        res.status(500).json({ message: error.message })
      })
  } else {
    res.status(400).json({
      message: 'You shall not pass!',
    })
  }
})

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

function isValid(user) {
  return Boolean(user.username && user.password && user.type && user.email && typeof user.password === 'string' && typeof user.username === 'string' && typeof user.type === 'string' && typeof user.email === 'string')
}

module.exports = router