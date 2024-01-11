import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
const env = import.meta.env;
import "@css/UniqueRecipe.css"

function Recipe() {
    const [recipeDetails, setRecipeDetails] = useState({
        Ingredients: []
    })
    const [similarRecepes, setSimilarRecepes] = useState({
        Recettes: []
    })
    const  [reload, setReload] = useState(false)

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
                        <h3>Recettes similaires</h3>
                        {similarRecepes ?
                            (similarRecepes.Recettes.map(
                                simRec => {
                                    return <div key={simRec.id}>
                                        <Link className={"simRecipeLink"} to={`/recipe/${simRec.id}`} onClick={() => setReload(!reload)}><h4>{simRec.name}</h4></Link>
                                        </div> }))
                                : <div>Pas de recettes similaires</div>}
                    </div>
                </div>

            </main>
        </>
    );
}

export default Recipe;