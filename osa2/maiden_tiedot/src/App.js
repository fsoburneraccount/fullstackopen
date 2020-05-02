import React, { useState, useEffect } from 'react'
import axios from 'axios'
import CountryList from './components/CountryList'
import FilterForm from './components/FilterForm'

const App = () => {
  const [ filterValue, setFilterValue ] = useState('')
  const [ countryList, setCountryList ] = useState([])

  useEffect(() => {
    axios
      .get("https://restcountries.eu/rest/v2/all")
      .then(response => {
        setCountryList(response.data)
      })
    }, [])

  const filterHandleChange = (event) => {
    setFilterValue(event.target.value)   
  }

  return (
    <div>
      <FilterForm filterLabel="find countries"
                  filterValue={filterValue}
                  filterHandleChange={filterHandleChange} />
      <CountryList countryList={countryList}
                   countryFilterValue={filterValue}
                   countrySetter={setFilterValue} />
    </div>
  )
}

export default App
