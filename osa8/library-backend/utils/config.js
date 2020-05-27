require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI
const SECRET = process.env.SECRET
const PASSWORD = process.env.PASSWORD

module.exports = { MONGODB_URI, SECRET, PASSWORD }

