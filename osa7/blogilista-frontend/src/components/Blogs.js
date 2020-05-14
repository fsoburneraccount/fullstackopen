import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import { createBlog } from '../reducers/blogReducer'
import { ListGroup } from 'react-bootstrap'

const Blogs = () => {
  const blogs = useSelector(state =>
    [...(state.blogs === null ? [] : state.blogs)].sort((x,y) => y.likes - x.likes)
  )

  const user = useSelector(state => state.user)

  const dispatch = useDispatch()

  const addBlog = (title, author, url) => {
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(title, author, url, user))
  }

  const blogFormRef = React.createRef()

  return (
    <div>
      <Togglable buttonLabel='new blog' ref={blogFormRef} >
        <h2>create new</h2>
        <BlogForm addBlog={addBlog}/>
      </Togglable>
      <ListGroup>
        {blogs.map(blog =>
          <ListGroup.Item key={blog.id}>
            <Link to={`blogs/${blog.id}`}>{blog.title}</Link>
          </ListGroup.Item>
        )}
      </ListGroup>
    </div>
  )
}

export default Blogs

