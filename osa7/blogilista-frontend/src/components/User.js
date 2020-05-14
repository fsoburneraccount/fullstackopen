import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ListGroup } from 'react-bootstrap'

const User = () => {

  const users = useSelector(state => state.users)
  const id = useParams().id
  const user = users.find(u => u.id === id)
  const blogs = useSelector(state => state.blogs.filter(b => b.user.id === user.id))

  if (!user) return null

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ListGroup>
        {blogs.map(blog =>
          <ListGroup.Item key={blog.id}><Link to={`../blogs/${blog.id}`}>{blog.title}</Link></ListGroup.Item>
        )}
      </ListGroup>
    </div>
  )
}

export default User

