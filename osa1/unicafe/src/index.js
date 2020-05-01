import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = (props) => (
    <button onClick={props.onClick}>
      {props.text}
    </button>
)

const FeedbackButtons = ({buttonData}) => {
  return (
    <div> 
      <Button text="good"    onClick={buttonData["good"].setter} />
      <Button text="neutral" onClick={buttonData["neutral"].setter} />
      <Button text="bad"     onClick={buttonData["bad"].setter} />
    </div>
  )
}

const StatisticLine = ({label, value}) => {
  return (
    <tr>
      <td>{label}</td>
      <td>{value}</td>
    </tr>
  )
}

const Summaries = ({stats}) => {
  const reviews = stats["good"].value +
    stats["neutral"].value +
    stats["bad"].value
  const score = stats["good"].value - stats["bad"].value
  const positive = (stats["good"].value/reviews*100) + " %"
  return ( 
    <>
      <tr>
        <td>all</td>
        <td>{reviews}</td> 
      </tr>
      <tr>
        <td>average</td>
        <td>{score/reviews}</td> 
      </tr>
      <tr>
        <td>positive</td>
        <td>{positive}</td> 
      </tr>
    </>
  )
}

const Statistics = ({stats}) => {

  const feedbackExists = stats["good"].value + 
    stats["neutral"].value + 
    stats["bad"].value > 0
  if (feedbackExists) {
    return (
      <table>
        <tbody>
          <StatisticLine label="good" value={stats["good"].value} />
          <StatisticLine label="neutral" value={stats["neutral"].value} />
          <StatisticLine label="bad" value={stats["bad"].value} />
          <Summaries stats={stats} />
        </tbody>
      </table>
    )
  }

  return (
    <div>
      <p> No feedback given </p>
    </div>
  )
}

const App = () => {

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const data = {
    "good": {
      value: good,
      setter: () => setGood(good + 1)
    },
    "neutral": {
      value: neutral,
      setter: () => setNeutral(neutral + 1)
    },
    "bad": {
      value: bad,
      setter: () => setBad(bad + 1)
    }
  }


  return (
    <div>
      <h1> give feedback </h1>
      <FeedbackButtons buttonData={data} />
      <h2> statistics </h2>
      <Statistics stats={data} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

