import anecdoteService from '../services/anecdotes'

const reducer = (state = [], action) => {
  switch(action.type) {
    case 'NEW_ANECDOTE':
      return [...state, action.data]
    case 'INIT_ANECDOTES':
      return action.data
    case 'VOTE':
      return state.map(a => a.id === action.data.id ? { ...a, votes: a.votes + 1 } : a )
    default: 
      return state
  }
}

export const initializeNotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({ type: 'INIT_ANECDOTES', data: anecdotes })
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({ type: 'NEW_ANECDOTE', data: newAnecdote })
  }
}

export const addVote = anecdote => {
  return async dispatch => {
    const updatedAnecdote = await anecdoteService.addVote(anecdote)
    dispatch({ type: 'VOTE', data: updatedAnecdote })
  }
}

export default reducer
