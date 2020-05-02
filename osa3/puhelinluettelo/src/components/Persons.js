import React from 'react'

const Persons = ({persons, removePerson}) => {
    return (
    <div>
      <h2>Numbers</h2>
      {persons.map(person=>
        <form onSubmit={removePerson(person)} key={person.id}>
          {person.name} {person.number}
          <button type="submit">delete</button>
        </form>
      )}
    </div>
  )
}

export default Persons

