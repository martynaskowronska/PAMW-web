import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Route, Routes, BrowserRouter} from 'react-router-dom';
import Auth from './components/auth';
import { CookiesProvider } from 'react-cookie';
import global_en from "./translations/english/global.json";
import global_pl from "./translations/polish/global.json";
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';

i18next.init({
  interpolation: {escapeValue: true},
  lng: "en",
  resources: {
    en: {
      global: global_en,
    },
    pl: {
      global: global_pl,
    },
  },
});

function Router(){

  return (
    <React.StrictMode>
      <I18nextProvider i18n = {i18next}>
        <CookiesProvider>
          <BrowserRouter>
            <Routes>
              <Route exact path="/" element={<Auth />}/>
              <Route exact path="/movies" element={<App />}/>
            </Routes>
          </BrowserRouter>
        </CookiesProvider>
      </I18nextProvider>
    </React.StrictMode>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
