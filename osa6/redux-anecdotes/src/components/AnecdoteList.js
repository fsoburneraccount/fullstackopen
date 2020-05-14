import React from 'react'
import { addVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import { useSelector, useDispatch } from 'react-redux'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    const filteredAnecdotes = state.filter
      ? state.anecdotes.filter(a => a.content.toLowerCase().includes(state.filter.toLowerCase()))
      : [...state.anecdotes]

    return filteredAnecdotes.sort((x,y) => y.votes - x.votes)
  })
  const dispatch = useDispatch()

  const vote = anecdote => {
    dispatch(addVote(anecdote))
    dispatch(setNotification(`you voted '${anecdote.content}'`, 2))
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList
