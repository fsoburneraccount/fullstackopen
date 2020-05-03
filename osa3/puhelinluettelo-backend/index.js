require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
morgan.token('json-body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json-body'))

app.get('/info', (req, resp, next) => {
  Person.find({})
    .then(persons => {
      const str = `<p>Phonebook has info for ${persons.length} people</p>` +
                  `<p>${Date()}</p>`
      resp.status(200).send(str)
    })
    .catch(error => next(error))
})

app.get('/api/persons', (req, resp, next) => {
  Person.find({})
    .then(persons => resp.json(persons.map(person => person.toJSON())))
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, resp, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person)
        resp.json(person.toJSON())
      else
        resp.status(404).end()
    })
    .catch(err => next(err)) })

app.post('/api/persons', (req, resp, next) => {
  const person = new Person({ name: req.body.name, number: req.body.number })
  person.save()
    .then(savedPerson => resp.json(savedPerson.toJSON()))
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, resp, next) => {
  const person = { name: req.body.name, number: req.body.number }

  Person
    .findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true })
    .then(updatedPerson => resp.json(updatedPerson.toJSON()))
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, resp) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => resp.status(204).end())
})

const errorHandler = (err, req, resp, next) => {
  console.log(err.message)
  console.log(err.name)
  if (err.name === 'CastError') {
    return (resp.status(400).send({ error: 'malformatted id' }))
  } else if (err.name === 'ValidationError') {
    return resp.status(400).send({ error: err.message })
  } else if (err.name === 'MongoError') {
    return resp.status(400).send({ error: err.message })
  }
  next(err)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

