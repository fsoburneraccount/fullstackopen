import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { removeBlog, likeBlog } from '../reducers/blogReducer'
import blogService from '../services/blogs'
import { Button, Form, ListGroup } from 'react-bootstrap'

const Blog = () => {
  const id = useParams().id
  const user = useSelector(state => state.user)
  const blog = useSelector(state => state.blogs.find(b => b.id === id))

  const dispatch = useDispatch()

  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')

  useEffect(() => {
    async function fetch() {
      if (blog !== undefined) {
        const comments = await blogService.getComments(blog.id)
        setComments(comments)
      }
    }
    fetch()
  }, [blog])

  const handleAddComment = async event => {
    event.preventDefault()
    const addedComment = await blogService.addComment(blog.id, comment)
    setComments(comments.concat(addedComment))
    setComment('')
  }

  if (!blog) return null

  const blogOfTheUser = blog.user.id === user.id

  const blogStyle = { paddingTop: 10, paddingLeft: 2, borderWidth: 1, marginBottom: 5 }

  const handleAddLike = () => {
    dispatch(likeBlog(blog, user.token))
  }

  const handleRemoveBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(removeBlog(blog.id, user.token))
    }
  }

  return (
    <div style={blogStyle}>
      {blog.title}, {blog.author}
      <div>
        <a href={blog.url}>{blog.url}</a> <br />
        likes {blog.likes} <Button variant='outline-primary' onClick={handleAddLike}>like</Button> <br />
        added by {blog.user.name} <br />
        {blogOfTheUser && <Button variant='light' onClick={handleRemoveBlog}>remove</Button>}
      </div>
      <div>
        <h3>comments</h3>
        <Form onSubmit={handleAddComment}>
          <Form.Control type='text' placeholder='Enter a comment' value={comment}
            onChange={({ target }) => setComment(target.value)} />
          <Button type='submit'>add comment</Button>
        </Form>
        <ListGroup>
          { comments.map(c => <ListGroup.Item key={c.id}>{c.comment}</ListGroup.Item> ) }
        </ListGroup>
      </div>
    </div>
  )
}
export default Blog

