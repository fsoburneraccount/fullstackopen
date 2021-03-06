const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users.map(u => u.toJSON()))
})

usersRouter.get('/:id', async (request, response) => {
  const user = await User
    .findById(request.params.id)
    .populate('blogs')
  if (user)
    response.json(user.toJSON())
  else
    response.status(404).end()
})


usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.password || body.password.length < 3) {
    return response.status(400).send({ error: 'password must have a length of at least 3' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    userName: body.userName,
    name: body.name,
    passwordHash: passwordHash,
    blogs: []
  })

  const savedUser = await user.save()
  response.json(savedUser)
})


module.exports = usersRouter

