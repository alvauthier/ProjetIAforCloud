import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import CommentAndRatingForm from './CommentAndRatingForm';
const env = import.meta.env;
import "@css/UniqueRecipe.css"

function Recipe() {
    const [recipeDetails, setRecipeDetails] = useState({
        Ingredients: [],
        Reviews: []
    })
    const [similarRecepes, setSimilarRecepes] = useState({
        Recettes: []
    })
    const [reload, setReload] = useState(false)
    const [accompaniments, setAccompaniments] = useState("")
    const [displayAccompaniement, setDisplayAccompaniments] = useState(false)
    const [isFavorited, setIsFavorited] = useState(false);

    const [comments, setComments] = useState([])
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [shoppingList, setShoppingList] = useState([]);

    let { id } = useParams()

    let nombreNote = recipeDetails.Reviews.length
    let note = 0
    for (let i = 0; i < nombreNote; i++) {
        note += parseInt(recipeDetails.Reviews[i].note)
    }
    note = note / nombreNote

    const handleAddCommentAndRating = (newCommentAndRating) => {
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

        async function fetchSimilarRecipe() {
            const recipeId = id;
            let detail = {}
            await new Promise(async () => {
                try {
                    const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/similarRecipe/${recipeId}`, {})
                        .then(response => response.json())
                        .then(data => {
                            const responseAI = JSON.parse(data.responseAI);
                            setSimilarRecepes(responseAI)
                        })
                    if (!response.ok) {
                        throw new Error(`Réponse non valide: ${response.status}`);
                    }
                } catch (error) {
                    console.error(`Erreur lors de la récupération des détails de la recette ${recipeId}:`, error);
                }
            })
        }

        fetchSimilarRecipe();
        fetchRecipeDetails();
    }, [reload]);

    console.log(recipeDetails.Ingredients.map(i => { return i.IngredientRecipe.quantity }))

    const handleFavoriteClick = async () => {
        if (isFavorited) {
            removeFavorite();
        } else {
            addFavorite();
        }
    }


    const addFavorite = async () => {
        const recipeId = id;
        try {
            const response = await fetch(
                `${env.VITE_URL}:${env.VITE_PORT_BACK}/favorites/${recipeId}`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                setIsFavorited(!isFavorited);
            } else {
                console.error('Erreur lors de l\'ajout de la restriction');
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la restriction:', error);
        }
    }

    const removeFavorite = async () => {
        const recipeId = id;
        try {
            const response = await fetch(
                `${env.VITE_URL}:${env.VITE_PORT_BACK}/favorites/${recipeId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                setIsFavorited(!isFavorited);
            } else {
                console.error('Erreur lors de l\'ajout de la restriction');
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la restriction:', error);
        }
    }

    useEffect(() => {
        async function checkIfFavorited() {
            const recipeId = id;
            try {
                const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/favorites/${recipeId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error(`Réponse non valide: ${response.status}`);
                }
                const { isFavorited } = await response.json();
                setIsFavorited(isFavorited);
            } catch (error) {
                console.error("Erreur lors de la récupération des favoris :", error);
            }
        }
        checkIfFavorited();
    }, []);

    async function fetchAccompanients() {
        const recipeId = id;
        let detail = {}
        await new Promise(async () => {
            try {
                const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/accompaniments/${recipeId}`, {})
                    .then(response => response.json())
                    .then(data => {
                        const responseAI = data.responseAI;
                        setAccompaniments(responseAI)
                        setDisplayAccompaniments(!displayAccompaniement)
                    })
                if (!response.ok) {
                    throw new Error(`Réponse non valide: ${response.status}`);
                }
            } catch (error) {
                console.error(`Erreur lors de la récupération des détails de la recette ${recipeId}:`, error);
            }
        })
    }

    function openPopup() {
        generateShoppingList();
        setIsPopupOpen(true);
    }

    function closePopup() {
        setIsPopupOpen(false);
    }

    async function generateShoppingList() {
        const recipeId = id;
        try {
            const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/shopping/${recipeId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`Réponse non valide: ${response.status}`);
            }
            const data = await response.json();
            setShoppingList(data.responseAI);
        } catch (error) {
            console.error(`Erreur lors de la génération de la liste de courses pour la recette ${recipeId}:`, error);
        }
    }

    return (
        <>
            <main>
                <h1>{recipeDetails.name}</h1>
                <button onClick={handleFavoriteClick}>
                    {isFavorited ? '❤️' : '🤍'}
                </button>
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
                            <div>{recipeDetails.Ingredients.map((ingredient) => { return <div key={ingredient.name}>{ingredient.IngredientRecipe.quantity} {ingredient.unit} {ingredient.name}</div> })}</div>
                        </div>
                    </div>

                    <div className="uniqueRecipeLayout_middle-col">
                        <h2>Instructions</h2>
                        <div>{recipeDetails.instructions}</div>
                        <div className="uniqueRecipe_accompaniment">
                            <button onClick={() => fetchAccompanients()}>{displayAccompaniement ? "Cacher" : "Afficher"} accompagnement</button>
                            {displayAccompaniement &&
                                <div className="uniqueRecipe_accompaniment">
                                    <h4>Accompagnement</h4>
                                    {accompaniments && accompaniments}
                                </div>
                            }
                        </div>
                    </div>

                    <div className="uniqueRecipeLayout_right-col">
                        <h3>Recettes similaires</h3>
                        {similarRecepes ?
                            (similarRecepes.Recettes.map(
                                simRec => {
                                    return <div key={simRec.id}>
                                        <Link className={"simRecipeLink"} to={`/recipe/${simRec.id}`} onClick={() => setReload(!reload)}><h4>{simRec.name}</h4></Link>
                                    </div>
                                }))
                            : <div>Pas de recettes similaires</div>}
                    </div>
                </div>
                <div>
                    <div className="">
                        <h4>Commentaires</h4>
                        <div>{recipeDetails.Reviews.map((review) => { return <div key={review.id}>{review.review}</div> })}</div>
                    </div>
                    <div className="">
                        <h4>Laisse un commentaire et une note</h4>
                        <CommentAndRatingForm setReload={setReload} reload={reload} />
                        {comments.map((comment) => {
                            <li key={index}>
                                <p>Commentaire : {comment.comment}</p>
                                <p>Note : {comment.rating}</p>
                            </li>
                        })}
                    </div>
                </div>
                <div>
                    {isPopupOpen ? (
                        <button onClick={closePopup}>Fermer la liste de course</button>
                    ) : (
                        <button onClick={openPopup}>Générer la liste de courses</button>
                    )}

                    {isPopupOpen && (
                        <div className="popup">
                            <h2>Liste de courses</h2>
                            <p>{shoppingList}</p>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

export default Recipe;