import React from 'react'
import BooksTable from './BooksTable'

const Recommended = ({show, books, genre}) => {
  if (!show) return null
  console.log(genre)
  return (
    <div>
      <h3>recommended</h3>
      <p>books in your favorite genre <b>{genre}</b></p>
      <BooksTable books={books} />
    </div>
  )
}

export default Recommended
