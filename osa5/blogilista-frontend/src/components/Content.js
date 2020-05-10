import React from 'react'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import Blog from './Blog'
import blogService from '../services/blogs'

const Content = ({ user, setUser, blogs, setBlogs, blogFormRef, setMessage }) => {

  const addBlog = async (title, author, url) => {
    blogFormRef.current.toggleVisibility()
    const sentBlog = await blogService
      .create({ title: title, author: author, url: url })

    setBlogs(blogs.concat({ ...sentBlog, user: user }))
    setMessage(`a new blog ${sentBlog.title} added`)
    setTimeout(() => { setMessage(null) }, 5000)
  }

  const handleAddLike = blog => async () => {
    const updatedBlog = await blogService
      .update(blog.id,
        { title: blog.title, author: blog.author, url: blog.url,
          likes: blog.likes + 1, user: blog.user })
    setBlogs(blogs.map(b => blog.id === b.id ? updatedBlog : b))
  }

  const handleRemoveBlog = blog => async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => blog.id !== b.id))
    }
  }

  const sortedBlogs = [...blogs].sort((x,y) => y.likes - x.likes)
  const logout = () => {
    window.localStorage.removeItem('loggedBlogilistaAppUser')
    setUser(null)
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in<button onClick={logout}>logout</button> </p>
      <Togglable buttonLabel='new blog' ref={blogFormRef} >
        <h2>create new</h2>
        <BlogForm addBlog={addBlog}/>
      </Togglable>
      {sortedBlogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user}
          handleAddLike={handleAddLike(blog)} handleRemoveBlog={handleRemoveBlog(blog)} />
      )}
    </div>

  )
}

export default Content

