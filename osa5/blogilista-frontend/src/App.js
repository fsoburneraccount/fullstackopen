import React, { useState, useEffect } from 'react'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Content from './components/Content'
import blogService from './services/blogs'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogilistaAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = React.createRef()

  return (
    <div>
      <Notification message={message} className="message" />
      <Notification message={errorMessage} className="error" />
      { user === null
        ? <LoginForm setUser={setUser} setErrorMessage={setErrorMessage} />
        : <Content user={user} setUser={setUser} blogs={blogs} setBlogs={setBlogs}
          blogFormRef={blogFormRef} setMessage={setMessage} />
      }
    </div>
  )
}

export default App

