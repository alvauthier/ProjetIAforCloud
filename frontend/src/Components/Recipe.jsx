import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import CommentAndRatingForm from './CommentAndRatingForm';
const env = import.meta.env;
import "@css/UniqueRecipe.css"

function Recipe() {
    const [recipeDetails, setRecipeDetails] = useState({
        Ingredients: [],
        Reviews: []
    })
    const [similarRecepes, setSimilarRecepes] = useState(null)

    const [comments, setComments] = useState([])

    const [reload, setReload] = useState(false)

    let { id } = useParams()

    let nombreNote = recipeDetails.Reviews.length
    let note = 0
    for(let i = 0; i < nombreNote; i++) {
        note += parseInt(recipeDetails.Reviews[i].note)
    }
    note = note / nombreNote

    const handleAddCommentAndRating =(newCommentAndRating) => {
        setComments([...comments, newCommentAndRating])
    }

    useEffect(() => {
        async function fetchRecipeDetails() {
            const recipeId = id;
            let detail = {}
            await new Promise(async () => {
                try {
                    const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/uniqueRecipe/${recipeId}`, {})
                    if (!response.ok) {
                        throw new Error(`Réponse non valide: ${response.status}`);
                    }

                    const data = await response.json();
                    detail = data
                } catch (error) {
                    console.error(`Erreur lors de la récupération des détails de la recette ${recipeId}:`, error);
                }
                return setRecipeDetails(detail);
            })
        }
        console.log(fetchRecipeDetails())
        fetchRecipeDetails();
    }, [reload]);
        console.log(recipeDetails)
    return (
        <>
            <main>
                <h1>{recipeDetails.name}</h1>
                <div className="uniqueRecipeLayout">
                    <div className="uniqueRecipeLayout_left-col">
                        <div>
                            <h4>Description</h4>
                            <div>{recipeDetails.description}</div>
                        </div>

                        <div>
                            <h4>Note</h4>
                            {note} ⭐ 
                        </div>

                        <div>
                            <h4>Ingrédients</h4>
                            <div>{recipeDetails.Ingredients.map((ingredient) => { return <div key={ingredient.name}>{ingredient.IngredientRecipe.quantity} {ingredient.unit} {ingredient.name}</div>})}</div>
                        </div>
                    </div>

                    <div className="uniqueRecipeLayout_middle-col">
                        <h2>Instructions</h2>
                        <div>{recipeDetails.instructions}</div>
                    </div>

                    <div className="uniqueRecipeLayout_right-col">
                        <h4>Recettes similaires</h4>
                        <div>{similarRecepes !== null ? similarRecepes.map(simRec => {return <div>{simRec}.name</div>}) : <div>Pas de recettes similaires</div>}</div>
                    </div>
                </div>
                <div>
                    <div className="">
                        <h4>Commentaires</h4>
                        <div>{recipeDetails.Reviews.map((review) => { return <div key={review.id}>{review.review}</div>})}</div>
                    </div>
                    <div className="">
                        <h4>Laisse un commentaire et une note</h4>
                        <CommentAndRatingForm setReload={setReload} reload={reload}/>
                        {comments.map((comment) => {
                            <li key={index}>
                               <p>Commentaire : {comment.comment}</p>
                               <p>Note : {comment.rating}</p> 
                            </li>})}
                    </div>
                </div>

            </main>
        </>
    );
}

export default Recipe;