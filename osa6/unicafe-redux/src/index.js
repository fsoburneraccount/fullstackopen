import React from 'react';
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(reducer)

const App = () => {
  const doAction = (actionType) => () => {
    store.dispatch({ type: actionType })
  }

  return (
    <div>
      <button onClick={doAction('GOOD')}>good</button> 
      <button onClick={doAction('OK')}>neutral</button> 
      <button onClick={doAction('BAD')}>bad</button>
      <button onClick={doAction('ZERO')}>reset stats</button>
      <div>good {store.getState().good}</div>
      <div>neutral {store.getState().ok}</div>
      <div>bad {store.getState().bad}</div>
    </div>
  )
}

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
}

renderApp()
store.subscribe(renderApp)
