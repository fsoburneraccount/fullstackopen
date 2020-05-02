import React, { useState, useEffect } from 'react'
import axios from 'axios'

const MultipleCountries = ({countries, countrySetter}) => {
  const submitSetter = (country) => (event) => {
    event.preventDefault()
    countrySetter(country)
  }
  return (
    <div>
      {countries.map(country=>
        <form onSubmit={submitSetter(country.name)}
              key={country.alpha2Code}>
          {country.name}
          <button type="submit">show</button>
        </form>
      )}
    </div>
  )
}

const Weather = ({city}) => {

  const apiKey = process.env.REACT_APP_API_KEY
  const [ temp, setTemp ] = useState('')
  const [ weatherIcons, setWeatherIcons ] = useState([])
  const [ wind, setWind ] = useState('')
  const [ windDir, setWindDir ] = useState('')

  useEffect(() => {
    axios
      .get(`http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}&units=m`)
      .then(response => {
        setTemp(response.data.current.temperature)
        setWind(response.data.current.wind_speed)
        setWindDir(response.data.current.wind_dir)
        const weatherIconsWithAlts = response.data.current.weather_icons
          .map((wi,i)=> {
            return ( { ind: i, icon: wi, 
                             desc: response.data.current.weather_descriptions[i]} )
          }
          )
        setWeatherIcons(weatherIconsWithAlts)
      })
    }, [city, apiKey])

  return (
    <div>
      <h2>Weather in {city}</h2>
      <p><b>temperature:</b> {temp} Celcius</p>
      {weatherIcons.map((wi)=> <img src={wi.icon} alt={wi.desc} key={wi.ind} />)}
      <p><b>wind:</b> {wind} km/h direction {windDir} </p>
    </div>
  )
}
const SingleCountry = ({country}) => {

  return (
    <div>
      <h2>{country.name}</h2>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <p><b>languages</b></p>
      <ul>
        {country.languages.map(lang=><li key={lang.iso639_1}>{lang.name}</li>)}
      </ul>
      <img src={country.flag} alt={`Flag of ${country.name}`} height="100" width="100"/>
      <Weather city={country.capital} />
    </div>
  )
}

const CountryList = ({countryList, countryFilterValue, countrySetter}) => {
  const countryFilter = c => c.name.toLowerCase().includes(countryFilterValue.toLowerCase())
  const filteredCountries = countryList.filter(countryFilter)

  if (filteredCountries.length>10) {
    return ( <p> Too many matches, specify another filter </p> )
  }

  if (filteredCountries.length!==1) {
    return ( <MultipleCountries countries={filteredCountries}
                                countrySetter={countrySetter}/> )
  }

  return ( <SingleCountry country={filteredCountries[0]} /> )
}

export default CountryList
