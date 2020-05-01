import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const Button = ({text, onClick}) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const BestAnecdote = ({anecdotes, votes}) => {
  const maxVotes = votes.reduce((x,y) => Math.max(x,y))
  const bestAnecdote = anecdotes[votes.findIndex((x) => x===maxVotes)]
  return (
    <div>
      <h2>Anecdote with most votes</h2>
      {bestAnecdote}
      <br/>
      has {maxVotes} votes
    </div>
  )
}

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const nAnecdotes = props.anecdotes.length
  const nextButton = () => setSelected((selected+1)%nAnecdotes)
  const [votes, setVotes] = useState(props.anecdotes.map(()=>0))
  const voteButton = () => {
    const newVotes = [...votes]
    newVotes[selected]++
    return setVotes(newVotes)
  }
  
  return (
    <div>
      <h2>Anecdote of the day</h2>
      {props.anecdotes[selected]}
      <br />
      has {votes[selected]} votes
      <br />
      <Button text="vote" onClick={voteButton} /> 
      <Button text="next anecdote" onClick={nextButton} /> 
      <BestAnecdote anecdotes={props.anecdotes} votes={votes} />
    </div>
  )
}

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)

