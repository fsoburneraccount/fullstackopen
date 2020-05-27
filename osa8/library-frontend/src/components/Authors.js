import React, { useState } from 'react'

const Authors = ({show, authors, updateAuthorBorn, isAuthenticated}) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  if (!show) return null
  if (!authors.data || authors.loading) return ( <div>loading...</div> )

  const submit = async (event) => {
    event.preventDefault()

    if (born !== '') {
      updateAuthorBorn(name, Number(born))
      setName('')
      setBorn('')
    }
  }

  const editForm = () => (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <label>
          name
          <select value={name} onChange={({ target }) => setName(target.value)}>
            {authors.data.allAuthors.concat({ name: '' }).map(a => 
              <option key={a.name} value={a.name}>{a.name}</option>
            )}
          </select>
        </label>
        <div>
          born
          <input
            type='number'
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.data.allAuthors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      { isAuthenticated ? editForm() : null }
    </div>
  )
}

export default Authors
