import React, {useEffect, useState} from 'react';
import "@css/RecipeList.css";
import {useParams} from "react-router-dom";
const env = import.meta.env;

function Recipe() {
    const [recipeDetails, setRecipeDetails] = useState({})
    let { id } = useParams()

    useEffect(() => {
        async function fetchRecipeDetails() {
            const recipeId = id;
            let detail = {}
            await new Promise(async () => {
                    try {
                        const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/recipes/${recipeId}`)
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

    return (
        <>
            <main>
                <h1>{recipeDetails.name}</h1>

                <div>
                    <h2>Ingrédients</h2>
                    <div>Refaire une route api pour fetch les ingrédients avec le bout de code ligne 20 du search.js </div>
                </div>
            </main>
        </>
    );
}

export default Recipe;