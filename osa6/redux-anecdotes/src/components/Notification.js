import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  const noStyle = {}
  return (
    <div style={notification ? style : noStyle }>
      {notification}
    </div>
  )
}

export default Notification
