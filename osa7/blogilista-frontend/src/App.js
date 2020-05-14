import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  BrowserRouter as Router,
  Switch, Route, Link
} from 'react-router-dom'
import { Button } from 'react-bootstrap'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import Blogs from './components/Blogs'
import User from './components/User'
import Users from './components/Users'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUsers } from './reducers/userReducer'
import { setLoggedUser, removeLoggedUser } from './reducers/loginReducer'

const Content = () => {
  const user = useSelector(state => state.user)

  const dispatch = useDispatch()

  const logout = () => dispatch(removeLoggedUser())

  const padding = { paddingRight: 5 }
  return (
    <div>
      <Router>
        <div>
          <Link style={padding} to='/'>blogs</Link>
          <Link style={padding} to='/users'>users</Link>
          {user.name} logged in<Button variant='light' onClick={logout}>logout</Button>
        </div>
        <h2>blog app</h2>
        <Switch>
          <Route path='/users/:id'>
            <User />
          </Route>
          <Route path='/users'>
            <Users />
          </Route>
          <Route path='/blogs/:id'>
            <Blog />
          </Route>
          <Route path='/'>
            <Blogs />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

const App = () => {
  const dispatch = useDispatch()

  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogilistaAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setLoggedUser(user))
    }
  }, [dispatch])

  return (
    <div className='container'>
      <Notification />
      { user === null
        ? <LoginForm />
        : <Content />
      }
    </div>
  )
}

export default App

