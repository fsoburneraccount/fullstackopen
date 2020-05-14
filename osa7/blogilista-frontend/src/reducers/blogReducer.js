import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const reducer = (state = [], action) => {
  switch(action.type) {
  case 'INIT_BLOGS':
    return action.data
  case 'NEW_BLOG':
    return [...state, action.data]
  case 'REMOVE_BLOG':
    return state.filter(b => b.id !== action.data.id)
  case 'LIKE':
    return state.map(b => b.id === action.data.id ? { ...b, likes: b.likes + 1 } : b )
  default:
    return state
  }
}

export const createBlog = (title, author, url, user) => {
  return async dispatch => {
    const newBlog = await blogService.create({ title, author, url }, user.token)
    dispatch(setNotification(`a new blog ${title} added`, 'success', 2))
    dispatch({ type: 'NEW_BLOG', data: { ...newBlog, user } })
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({ type: 'INIT_BLOGS', data: blogs })
  }
}

export const likeBlog = (blog, token) => {
  return async dispatch => {
    await blogService
      .update(blog.id,
        { title: blog.title, author: blog.author, url: blog.url,
          likes: blog.likes + 1, user: blog.user }, token)
    dispatch({ type: 'LIKE', data : { id: blog.id } })
  }
}

export const removeBlog = (id, token) => {
  return async dispatch => {
    await blogService.remove(id, token)
    dispatch({ type: 'REMOVE_BLOG', data: { id } })
  }
}

export default reducer

