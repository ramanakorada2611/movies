import React, { useEffect, useState } from 'react'
import Search from './components/search'
import Spinner from './components/Spinner'
import Movie from './components/Movie'
import { useDebounce } from 'react-use'
import { getTrandingMovies, updateSearchCount } from './appwrite'

const API_BASE_URL = `https://api.themoviedb.org/3`
const TMDB_API_TOKEN = import.meta.env.VITE_API_TMDB_TOKEN
const TMDB_API_TOKEN_SEARCH = import.meta.env.VITE_API_TMDB_TOKEN_SEARCH

// console.log('token', TMDB_API_TOKEN, TMDB_API_TOKEN_SEARCH)


const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [moviesList, setMoviesList] = useState([])
  const [trandingMovies, setTrandingMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [debounce, setDebounce] = useState('')

  //Debounce the search term to prevent the making to many request
  //by waiting for the user to stop typing then api call

  useDebounce(() => setDebounce(searchTerm), 500, [searchTerm])//dealy for 500ms


  //api calling function for movies
  const apiFetch = async (query = '') => {
    setLoading(true)
    setErrorMessage('')
    try {
      let API_OPTIONS;
      if (query) {
        API_OPTIONS = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_API_TOKEN_SEARCH}`
          }
        }
      } else {
        API_OPTIONS = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_API_TOKEN}`
          }
        }
      }
      const endPoint = query ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
      console.log(endPoint)
      const response = await fetch(endPoint, API_OPTIONS)
      if (!response.ok) {
        throw new Error('Api Error')
      }
      const data = await response.json()
      if (data.Response == 'False') {
        setErrorMessage(data.Error || 'Failed to fetch')
        setMoviesList([])
        return
      }
      setMoviesList(data.results || [])
      // console.log("movieList", data.results)
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0])
      }

    } catch (error) {
      console.log('Error while fecthing', error)
      setErrorMessage('Error while fecthing. please try again')
    } finally {
      setLoading(false)
    }

  }

  useEffect(() => {
    apiFetch(debounce)
  }, [debounce])

  //api calling for tranding movies
  const apiTrandingMovie = async () => {
    try {
      const trandingMovie = await getTrandingMovies()
      console.log("movie", trandingMovie)
      setTrandingMovies(trandingMovie)
    } catch (error) {
      console('error while fetching tranding movies', error)
    }
  }
  useEffect(() => {
    apiTrandingMovie()
  }, [])

  return (
    <div className='pattern'>
      <div className='wrapper'>
        <header>
          <img src='./hero.png' alt='Hero Banner' />
          <h1>Find <span className='text-gradient'>Movies</span>You'll Enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        {
          trandingMovies.length > 0 && (
            <section className='trending'>
              <h2 className='text-white'>Trending Movies</h2>
              <ul>
                {
                  trandingMovies.map((movie, index) => (
                    <li key={movie.$id}>
                      <p>{index + 1}</p>
                      <img src={movie.poster_url} alt={movie.title} />
                    </li>
                  ))
                }
              </ul>
            </section>
          )
        }
        <section className='all-movies'>
          <h2 className='mt-[40px]'>All Movies</h2>
          {/* {errorMessage && <p className='text-red-500'>{errorMessage}</p>} */}
          {
            loading ? (<Spinner />) : errorMessage ? (<p className='text-red-500'>{errorMessage}</p>) : (
              <ul>
                {moviesList.map((movie) => (
                  // <p key={movie.id} className='text-violet-400'>{movie.title}</p>
                  <Movie key={movie.id} movie={movie} />
                ))}
              </ul>)
          }
        </section>
      </div>
    </div>

  )
}

export default App