import React, {useState, useEffect} from 'react';
import {API} from '../api-service'
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';

function MovieForm(props){

    const[title, setTitle] = useState('');
    const[description, setDescription] = useState('');
    const [token] = useCookies(['mr-token']);
    const [t, i18n] = useTranslation("global");

    useEffect(() => {
        setTitle(props.movie.title);
        setDescription(props.movie.description);
    }, [props.movie])

    const updateClicked = () => {
        API.updateMovie(props.movie.id, {title, description}, token['mr-token'])
        .then (resp => props.updatedMovie(resp))
        .catch( error => console.log(error))
    }

    const createClicked = () => {
        API.createMovie({title, description}, token['mr-token'])
        .then (resp => props.movieCreated(resp))
        .catch( error => console.log(error))
    }

    const isDisabled = title.length === 0 || description.length === 0;

    return (
        <React.Fragment>
            {props.movie ? (
                <div>
                    <label htmlFor="title">{t("label.title")}</label><br/>
                    <input id="title" type="text" placeholder={t("label.title")} value={title}
                        onChange={ evt => setTitle(evt.target.value)}
                    /><br/><br/><br/>
                    <label htmlFor="description">{t("label.description")}</label><br/>
                    <textarea id="description" type="text" placeholder={t("label.description")} value={description}
                        onChange={evt => setDescription(evt.target.value)}
                    ></textarea><br/><br/>
                    { props.movie.id ? 
                    <button onClick={updateClicked} disabled={isDisabled} className='button'>{t("button.save")}</button> :
                    <button onClick={createClicked} disabled={isDisabled} className='button'>{t("button.save")}</button> 
                    }       
                </div>
            ) : null }
        </React.Fragment>
    )
}

export default MovieForm