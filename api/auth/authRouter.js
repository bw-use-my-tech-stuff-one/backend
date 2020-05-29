const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = require('express').Router()

const Users = require('./authModel')
const createToken = require('./createToken')

router.post('/register', (req, res) => {
  // implement registration
  const credentials = req.body

  if (isValidRegister(credentials)) {
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

  if (isValidLogin(req.body)) {
    Users.findBy({ username })
      .then(([user]) => {
        // compare the password the hash stored in the database
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = createToken(user)

          res.status(200).json({ data: user, token })
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

function isValidRegister(user) {
  return Boolean(user.username && user.password && user.type && user.email && typeof user.password === 'string' && typeof user.username === 'string' && typeof user.type === 'string' && typeof user.email === 'string')
}

function isValidLogin(user) {
    return Boolean(user.username && user.password && typeof user.password === 'string' && typeof user.username === 'string')
}

module.exports = router