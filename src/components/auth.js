import React, {useState, useEffect, createContext} from 'react';
import {API} from '../api-service';
import { useCookies } from 'react-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm} from '@fortawesome/free-solid-svg-icons';
import ReactSwitch from 'react-switch';
import { useTranslation } from 'react-i18next';

export const ThemeContext = createContext(null);

function Auth(){

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useCookies(['mr-token']);
    const [isLoginView, setIsLoginView] = useState(true);
    const [theme, setTheme] = useState("dark"); 
    const [t, i18n] = useTranslation("global");
    const [language, setLanguage] = useState("en");

    useEffect(() => {
        if (token['mr-token']) window.location.href = '/movies';
    }, [token])

    const loginClicked = () => {
        API.loginUser({username, password})
        .then(resp => setToken('mr-token', resp.token))
        .catch(error => console.log(error))
    }

    const registerClicked = () => {
        API.registerUser({username, password})
        .then(() => loginClicked())
        .catch(error => console.log(error))
    }

    const toggleTheme = () => {
        setTheme((curr) => (curr === "light" ? "dark" : "light"));
    }

    const toggleLanguage = (lang) => {
        setLanguage((curr) => (curr === "en" ? "pl" : "en"));
        i18n.changeLanguage(lang);
      }
    
    const isDisabled = username.length === 0 || password.length === 0;

    return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
    <div className='Auth-container' id={theme}>
        <header className="Auth-logo">
            <h1>
                <FontAwesomeIcon icon={faFilm}/>
                <span>Movie rater</span>
            </h1>
        </header>
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
            <div className='Auth'>
                <div className='Login-box'>
                    <header className='Auth-header'>
                        { isLoginView ? <h1>{t("login.login")}</h1> : <h1>{t("login.register")}</h1>}
                    </header>
                    <div className='core'>
                        <label htmlFor="username">{t("login.username")}</label><br/>
                        <input id="username" type="text" placeholder={t("login.username")} value={username}
                                onChange={ evt => setUsername(evt.target.value)}
                        /><br/><br/>
                        <label htmlFor="password">{t("login.password")}</label><br/>
                        <input id="password" type="password" placeholder={t("login.password")} value={password}
                            onChange={evt => setPassword(evt.target.value)}/><br/><br/>
                        { isLoginView ? 
                            <button onClick={loginClicked} disabled={isDisabled} className='button'>{t("login.login")}</button> : 
                            <button onClick={registerClicked} disabled={isDisabled} className='button'>{t("login.register")}</button>
                        }
                        { isLoginView ? 
                            <p onClick={() => setIsLoginView(false)}>{t("login.loginInfo")}</p> :
                            <p onClick={() => setIsLoginView(true)}>{t("login.registerInfo")}</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    </ThemeContext.Provider>
    )
}

export default Auth;