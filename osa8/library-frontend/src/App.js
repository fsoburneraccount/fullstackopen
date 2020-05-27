import React, { useState, useEffect } from 'react'
import { useLazyQuery, useMutation, useSubscription, useApolloClient } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommended from './components/Recommended'
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'
import { ALL_AUTHORS, ALL_BOOKS, BOOKS_FOR_GENRE
       , CREATE_BOOK, SET_AUTHOR_BORN
       , ME, BOOK_ADDED } from './queries'

const unique = arr => (
  arr.reduce(
    (uniques, v) => uniques.findIndex(x => x === v)>=0 ? uniques : uniques.concat(v),
    [])
)

const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('login')
  const [errorMessage, setErrorMessage] = useState(null)
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [books, setBooks] = useState([])
  const [personalGenre, setPersonalGenre] = useState('')
  const [personalBooks, setPersonalBooks] = useState([])
  const [getAuthors, authorsResult] = useLazyQuery(ALL_AUTHORS)
  const [getAllBooks, allBooksResult] = useLazyQuery(ALL_BOOKS)
  const [getSelectedBooks, selectedBooksResult] = useLazyQuery(BOOKS_FOR_GENRE)
  const [getPersonalBooks, personalBooksResult] = useLazyQuery(BOOKS_FOR_GENRE)
  const [getMe, meResult] = useLazyQuery(ME)
  const client = useApolloClient()

  useEffect(() => { 
    getAllBooks()
    getAuthors()
  }, [getAllBooks, getAuthors])

  useEffect(() => {
    if (!allBooksResult.loading && allBooksResult.data) {
      const genres = unique(allBooksResult.data.allBooks.map(x => x.genres).flat())
      setGenres(genres)
    }
  }, [allBooksResult])

  useEffect(() => {
    getSelectedBooks({ variables: { genre } })
  }, [genre, getSelectedBooks])

  useEffect(() => {
    if (genre === '') {
      if (!allBooksResult.loading && allBooksResult.data)
        setBooks(allBooksResult.data.allBooks)
    } else {
      if (!selectedBooksResult.loading && selectedBooksResult.data)
        setBooks(selectedBooksResult.data.allBooks)
    }
  }, [genre, selectedBooksResult, allBooksResult])

  useEffect(() => {
    if (!authorsResult.loading && authorsResult.data) setBooks(authorsResult.data.allAuthors)
  }, [authorsResult])

  useEffect(() => {
    if (!meResult.loading && meResult.data) {
      const personalGenre = meResult.data.me ? meResult.data.me.favoriteGenre : ''
      setPersonalGenre(personalGenre)
    } 
  }, [meResult])
  useEffect(() => {
    getPersonalBooks({ variables: { genre: personalGenre } })
  }, [personalGenre, getPersonalBooks])
  useEffect(() => {
    if (!personalBooksResult.loading && personalBooksResult.data)
      setPersonalBooks(personalBooksResult.data.allBooks)
  }, [personalBooksResult])
  
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('library-user-token')
    if (tokenFromStorage) {
      setToken(tokenFromStorage)
      setPage('authors')
      getMe()
    }
  }, [getMe])

  const notify = message => {
    setErrorMessage(message)
    setTimeout(() => { setErrorMessage(null) }, 5000)
  }

  const [ createBook ] = useMutation(CREATE_BOOK, {
    refetchQueries: [ { query: ALL_BOOKS }, { query: ALL_AUTHORS },
                      { query: BOOKS_FOR_GENRE, variables: { genre }},
                      { query: BOOKS_FOR_GENRE, variables: { genre: personalGenre }}],
    onError: (error) => { notify(error.graphQLErrors[0].message) }
  })
  const [ setAuthorBorn ] = useMutation(SET_AUTHOR_BORN, {
    refetchQueries: [ { query: ALL_AUTHORS } ],
    onError: (error) => { notify(error.graphQLErrors[0].message) }
  })

  const updateAuthorBorn = (name, born) => {
    setAuthorBorn({ variables: { name, born: Number(born) } })
    getAuthors()
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      notify(`A new book ${subscriptionData.data.bookAdded.title} added`)
    }
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    getMe()
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        { token ? <button onClick={() => setPage('add')}>add book</button> : null } 
        { token ? <button onClick={() => setPage('recommended')}>recommended</button> : null } 
        { token ? <button onClick={logout}>logout</button> :
            <button onClick={() => setPage('login')}>login</button> }
      </div>

      <Authors show={page === 'authors'} authors={authorsResult} updateAuthorBorn={updateAuthorBorn} isAuthenticated={!!token} />
      <Books show={page === 'books'} books={books} genres={genres} setGenre={setGenre} />
      <NewBook show={page === 'add'} createBook={createBook} />
      <Recommended show={page === 'recommended'} books={personalBooks} genre={personalGenre} />
      <LoginForm show={page === 'login'} setToken={setToken} setPage={setPage} getMe={getMe} notify={notify} />
    </div>
  )
}

export default App
