import React from 'react'
import BooksTable from './BooksTable'

const Books = ({show, books, genres, setGenre}) => {
  if (!show) return null

  if (books===[]) return ( <div>loading...</div> )

  return (
    <div>
      <h2>books</h2>
      <BooksTable books={books} />
      {genres.map(g => 
        <button key={g} onClick={()=>setGenre(g)}>{g}</button>
      )}
      <button onClick={()=>setGenre('')}>all genres</button>
    </div>
  )
}

export default Books
