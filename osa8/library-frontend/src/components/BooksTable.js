import React from 'react'

const BookTable = ({books}) => (
  <table>
    <tbody>
      <tr>
        <th></th>
        <th>
          <b>author</b>
        </th>
        <th>
          <b>published</b>
        </th>
      </tr>
      {books.map(a =>
        <tr key={a.title}>
          <td>{a.title}</td>
          <td>{a.author.name}</td>
          <td>{a.published}</td>
        </tr>
      )}
    </tbody>
  </table>
)

export default BookTable
