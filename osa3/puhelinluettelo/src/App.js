import React, { useState, useEffect } from 'react'
import Forms from './components/Forms'
import Persons from './components/Persons'
import personService from './services/persons'

const Notification = ({ message, className }) => {
  if (message === null) { return null }

  return ( <div className={className}> {message} </div> )
}

const App = () => {
  const [ persons, setPersons] = useState([]) 
    useEffect(() => {
      personService
        .getAll()
        .then(initialPersons => {
          setPersons(initialPersons)
        })
    }, [])

  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const fields = [
    { id: 0, label: "name", value: newName,
      handleChange: (event) => {
        setNewName(event.target.value)
      }
    },
    { id: 1, label: "number", value: newNumber,
      handleChange: (event) => {
        setNewNumber(event.target.value)
      }
    }
  ]

  const showMsg = (msg, person) => {
    setMessage(`${msg} ${person.name}`)
    setTimeout(() => { setMessage(null) }, 5000)
  }

  const showError = msg => {
    setErrorMessage(msg)
    setTimeout(() => { setErrorMessage(null) }, 5000)
  }

  const handleDeleted = person => {
    showError(`Information of ${person.name} does not exist on the server`)
    setPersons(persons.filter(p => p.name !== person.name))
  }

  const handleBackendError = (err) => showError(err.error)

  const updateError = err => showError(err.toString())

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = { name: newName, number: newNumber }
    const personInd = persons.findIndex(p => p.name === newPerson.name)
    const common = (msg, person) => {
      setNewName('')
      setNewNumber('')
      showMsg(msg, person)
    }
    if (personInd<0) {
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          common("Added", returnedPerson)
        })
        .catch(err => handleBackendError(err.response.data))
    } else {
      const confirmationDialogue = `${newPerson.name} is already added to phonebook, ` +
        `replace the old number with a new one?`
      if (window.confirm(confirmationDialogue)) {
        const newPersonId = persons[personInd].id
        personService
          .update(newPersonId, newPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id === newPersonId ? returnedPerson : p))
            common("Updated", returnedPerson)
          })
          .catch(error => updateError(error))
      }
    }
  }

  const removePerson = person => event => {
    event.preventDefault()
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .del(person.id)
        .then(data => {
          setPersons(persons.filter(p => p.id !== person.id))
          showMsg("Deleted", person)
        })
        .catch(err => handleDeleted(err))
    }
  }

  const [ nameFilterValue, setNameFilterValue ] = useState('')
  const nameFilterHandleChange = event => setNameFilterValue(event.target.value)
  const nameFilter = name => name.toLowerCase().includes(nameFilterValue.toLowerCase())
  const personsToShow = persons.filter(p => nameFilter(p.name))

  const [ errorMessage, setErrorMessage ] = useState(null)
  const [ message, setMessage ] = useState(null)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} className="message" />
      <Notification message={errorMessage} className="error" />
      <Forms.FilterForm nameFilterValue={nameFilterValue}
                  nameFilterHandleChange={nameFilterHandleChange} />
      <Forms.InsertForm addValueToList={addPerson} fields={fields}/>
      <Persons persons={personsToShow} removePerson={removePerson} />
    </div>
  )
}

export default App

