import React, { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const handleAddBlog = async (event) => {
    event.preventDefault()
    await addBlog(blogTitle, blogAuthor, blogUrl)
    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }

  return (
    <form onSubmit={handleAddBlog}>
      title:
      <input id='title' type='text'
        value={blogTitle} onChange={({ target }) => setBlogTitle(target.value)} />
      <br />
      author:
      <input id='author' type='text'
        value={blogAuthor} onChange={({ target }) => setBlogAuthor(target.value)} />
      <br />
      url:
      <input id='url' type='text'
        value={blogUrl} onChange={({ target }) => setBlogUrl(target.value)} />
      <br />
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm

