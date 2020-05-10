require('dotenv').config()

const PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI
const NODE_ENV = process.env.NODE_ENV
const SECRET = process.env.SECRET
let TESTUSER_PASS = 'this is not needed outside of testing'

if (NODE_ENV === 'test') MONGODB_URI = process.env.TEST_MONGODB_URI
if (NODE_ENV === 'test') TESTUSER_PASS = process.env.TESTUSER_PASS

module.exports = { MONGODB_URI, NODE_ENV, PORT, TESTUSER_PASS, SECRET }

