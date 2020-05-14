import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../reducers/loginReducer'
import { Form, Button } from 'react-bootstrap'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const handleLogin = async event => {
    event.preventDefault()
    dispatch(login(username, password))
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>log in to application</h2>
      <Form onSubmit={handleLogin}>
        <Form.Label>username</Form.Label>
        <Form.Control type='text' value={username} name='Username'
          onChange={({ target }) => setUsername(target.value)} />
        <Form.Label>Password</Form.Label>
        <Form.Control type='password' value={password} name='Password'
          onChange={({ target }) => setPassword(target.value)} />
        <Button variant='primary' type='submit'>login</Button>
      </Form>
    </div>
  )
}

export default LoginForm

