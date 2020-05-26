const express = require('express')
const cors = require('cors')
const listingsRouter = require('./listings/listingsRouter')
const authRouter = require('./auth/authRouter')

const server = express()
server.use(cors())
server.use(express.json())
server.use('/api/auth', authRouter)
server.use('/api/listings', listingsRouter)

module.exports = server