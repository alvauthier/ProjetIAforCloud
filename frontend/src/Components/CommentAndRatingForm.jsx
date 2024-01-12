import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
const env = import.meta.env;

const CommentAndRatingForm = ({setReload, reload}) => {
    const [comment, setComment] = useState('')
    const [rating, setRating] = useState('')
    
    let recipeId = useParams();
    
    const handleCommentChange = (e) => {
        setComment(e.target.value);
    }

    const handleRatingChange = (e) => {
        setRating(e.target.value);
    }



    const handleSubmit = async (e) => {

        e.preventDefault();
        try {
            const response = await fetch (`${env.VITE_URL}:${env.VITE_PORT_BACK}/reviews/${recipeId.id}`, {
                method: 'POST',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({comment, rating})
            });
            if (response.ok) {
                console.log('commentaire et note ok');
            setComment('');
            setRating('');
            setReload(!reload);
            }else {
                console.log('commentaire et note pas ok');
            }
        } catch (error) {
            console.log('erreur lors de l\'envoi du commentaire et de la note');
            console.log(error)
        }
    }


    return (
        <form onSubmit={handleSubmit}>
        <label>
            Commentaire : 
            <textarea value={comment} onChange={handleCommentChange}/>
        </label>
        <label>
            Note : 
            <input type="number" value={rating} min="1" max="5" onChange={handleRatingChange}/>
        </label>
        <button type="submit">Envoyer</button>
        </form>
    )
};

export default CommentAndRatingForm;