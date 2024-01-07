import React, { useState, useEffect, createContext } from 'react'
import './App.css';
import MovieList from './components/movie-list';
import MovieDetails from './components/movie-details';
import MovieForm from './components/movie-form'
import { useCookies } from 'react-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import { useFetch } from './hooks/useFetch';
import ReactSwitch from 'react-switch';
import { useTranslation } from 'react-i18next';

export const ThemeContext = createContext(null);

function App() {

  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [editedMovie, setEditedMovie] = useState(null);
  const [token, setToken, deleteToken] = useCookies(['mr-token']);
  const [data, loading, error] = useFetch();
  const [theme, setTheme] = useState("dark"); 
  const [t, i18n] = useTranslation("global");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    setMovies(data);
  }, [data])

  useEffect(() => {
    if (!token['mr-token']) window.location.href = '/';
  }, [token])

  const loadMovie = movie => {
    setSelectedMovie(movie);
    setEditedMovie(null);
  }

  const editClicked = movie => {
    setSelectedMovie(null);
    setEditedMovie(movie);
  }

  const updatedMovie = movie => {
    const newMovies = movies.map(mov => {
      if (mov.id === movie.id){
        return movie;
      }
      return mov;
    })
    setMovies(newMovies);
  }

  const newMovie = () => {
    setEditedMovie({title: '', description: ''});
    setSelectedMovie(null);
  }

  const movieCreated = movie => {
    const newMovies = [...movies, movie];
    setMovies(newMovies);
  }

  const removeClicked = movie => {
    const newMovies = movies.filter(mov => mov.id !== movie.id);
    setMovies(newMovies);
  }

  const logoutUser = () => {
    deleteToken(['mr-token']);
  }

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  }

  const toggleLanguage = (lang) => {
    setLanguage((curr) => (curr === "en" ? "pl" : "en"));
    i18n.changeLanguage(lang);
  }

  if(loading) return <h1>Loading...</h1>
  if(error) return <h1>Error loading movies</h1>

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      <div className="App" id={theme}>
        <header className="App-header">
          <h1>
            <FontAwesomeIcon icon={faFilm}/>
              <span>Movie rater</span>
          </h1>
          <div className='language'>
            { language === 'en' ? (
            <>
              <button className='selected-language-button' id={language} onClick={() => toggleLanguage("en")}>EN</button>
              <button className='language-button' id={language} onClick={() => toggleLanguage("pl")}>PL</button>
            </> ) : (
            <> 
              <button className='language-button' id={language} onClick={() => toggleLanguage("en")}>EN</button>
              <button className='selected-language-button' id={language} onClick={() => toggleLanguage("pl")}>PL</button>
            </> )
            }
          </div>
          <div className='switch'>
            <ReactSwitch onChange={toggleTheme} checked={theme === "dark"}/>
          </div>
          <FontAwesomeIcon icon={faSignOutAlt} onClick={logoutUser}/>
        </header>
        <div className = "layout">
        <div className="empty-column"></div>
          <div>
            <MovieList 
            movies={movies} 
            movieClicked={loadMovie} 
            editClicked={editClicked}
            removeClicked={removeClicked}
            />
            <button onClick={newMovie} className='button'>{t("button.newMovie")}</button>
          </div>
          <div className='center-column'>
            <MovieDetails movie={selectedMovie} updateMovie={loadMovie}/>
            { editedMovie ? 
              <MovieForm movie={editedMovie} updatedMovie={updatedMovie} movieCreated={movieCreated}/>
              : null }
          </div>
          </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
