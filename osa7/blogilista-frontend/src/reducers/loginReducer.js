import loginService from '../services/login'
import { setNotification } from './notificationReducer'

const reducer = (state = null, action) => {
  switch(action.type) {
  case 'SET_USER':
    return action.data
  case 'LOGIN':
    return action.data
  case 'LOGOUT':
    return null
  default:
    return state
  }
}

export const login = (username, password) => {
  return async dispatch => {
    try {
      const loggedUser = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogilistaAppUser', JSON.stringify(loggedUser))
      dispatch({ type: 'LOGIN', data: loggedUser })
    } catch (exception) {
      dispatch(setNotification('wrong credentials', 'danger', 5))
    }
  }
}

export const setLoggedUser = user => {
  return async dispatch => {
    dispatch({ type: 'SET_USER', data: user })
  }
}

export const removeLoggedUser = () => {
  return dispatch => {
    window.localStorage.removeItem('loggedBlogilistaAppUser')
    dispatch({ type: 'LOGOUT' })
  }
}

export default reducer

