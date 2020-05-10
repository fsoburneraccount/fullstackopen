import React, { useState } from 'react'

const Blog = ({ blog, user, handleAddLike, handleRemoveBlog }) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }
  const toggleText = visible ? 'hide' : 'view'
  const blogOfTheUser = blog.user.id === user.id

  const toggleVisibility = () => { setVisible(!visible) }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      {blog.title}, {blog.author}
      <button onClick={toggleVisibility}>{toggleText}</button>
      <div style={showWhenVisible}>
        {blog.url} <br />
        likes {blog.likes} <button onClick={handleAddLike}>like</button> <br />
        {blog.user.name} <br />
        {blogOfTheUser && <button onClick={handleRemoveBlog}>remove</button>}
      </div>
    </div>
  )
}

export default Blog

