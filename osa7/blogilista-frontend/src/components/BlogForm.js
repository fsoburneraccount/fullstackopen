import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const BlogForm = ({ addBlog }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const handleAddBlog = async event => {
    event.preventDefault()
    await addBlog(blogTitle, blogAuthor, blogUrl)
    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }

  return (
    <Form onSubmit={handleAddBlog}>
      <Form.Label>title</Form.Label>
      <Form.Control id='title' type='text'
        value={blogTitle} onChange={({ target }) => setBlogTitle(target.value)} />
      <Form.Label>author</Form.Label>
      <Form.Control id='author' type='text'
        value={blogAuthor} onChange={({ target }) => setBlogAuthor(target.value)} />
      <Form.Label>url</Form.Label>
      <Form.Control id='url' type='text'
        value={blogUrl} onChange={({ target }) => setBlogUrl(target.value)} />
      <Button variant='primary' type="submit">create</Button>
    </Form>
  )
}

export default BlogForm

