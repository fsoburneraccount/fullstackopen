const reducer = (state = null, action) => {
  switch(action.type) {
  case 'NOTIFICATION':
    return action.data
  case 'CLEAR_NOTIFICATION':
    return null
  default:
    return state
  }
}

const clearNotification = () => {
  return { type: 'CLEAR_NOTIFICATION' }
}

export const setNotification = (content, variant, timeOut) => {
  return dispatch => {
    setTimeout(() => dispatch(clearNotification()), timeOut*1000)
    dispatch({ type: 'NOTIFICATION', data: { content, variant } })
  }
}

export default reducer
