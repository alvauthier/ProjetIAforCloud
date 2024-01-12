import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
const env = import.meta.env;
import "@css/UniqueRecipe.css"

function Recipe() {
    const [recipeDetails, setRecipeDetails] = useState({
        Ingredients: []
    })
    const [similarRecepes, setSimilarRecepes] = useState(null)
    const [isFavorited, setIsFavorited] = useState(false);

    let { id } = useParams()

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
        fetchRecipeDetails();
    }, []);
        console.log(recipeDetails.Ingredients.map(i=> {return i.IngredientRecipe.quantity}))

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
                            {recipeDetails.note ? recipeDetails.note : 0}
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

            </main>
        </>
    );
}

export default Recipe;