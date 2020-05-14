import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const Users = () => {
  const blogs = useSelector(state => state.blogs)
  const users = useSelector(state => state.users)

  return (
    <div>
      <h2>Users</h2>
      <Table striped>
        <thead>
          <tr><th></th><th>blogs created</th></tr>
        </thead>
        <tbody>
          { users.map(u =>
            <tr key={u.id}>
              <th><Link to={`users/${u.id}`}>{u.name}</Link></th>
              <th>{blogs.filter(b => b.user.id === u.id).length}</th>
            </tr>
          ) }
        </tbody>
      </Table>
    </div>
  )
}

export default Users

