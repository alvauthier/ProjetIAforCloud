import React, { useState, useEffect } from 'react';
import "@css/RecipeList.css";
import {useNavigate} from "react-router-dom";

const env = import.meta.env;

const RecipeList = ({ recipes }) => {
    const [recipeDetails, setRecipeDetails] = useState({});
    let navigate = useNavigate()
    function handleConsult(recipeId) {
        navigate(`/recipe/${recipeId}`)
    }
    useEffect(() => {
        const fetchRecipeDetails = async () => {
            const details = {};

            await Promise.all(
                recipes.map(async (recipeId) => {
                    try {
                        const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/recipes/${recipeId}`)
                        if (!response.ok) {
                            throw new Error(`Réponse non valide: ${response.status}`);
                        }
                        console.log(response)
                        const data = await response.json();
                        details[recipeId] = data;
                    } catch (error) {
                        console.error(`Erreur lors de la récupération des détails de la recette ${recipeId}:`, error);
                    }
                })
            );

            setRecipeDetails(details);
        };

        fetchRecipeDetails();
    }, [recipes]);



    return (
        <div className="recipe-list">
            {recipes.length > 0 ? (
                recipes.map((recipeId, index) => (
                    <div key={index} className="recipe">
                        {recipeDetails[recipeId] ? (
                            <>
                                <h2>{recipeDetails[recipeId].name}</h2>
                                <img src={recipeDetails[recipeId].image} alt={recipeDetails[recipeId].name} width="250px"/>
                                <p>{recipeDetails[recipeId].description}</p>
                                <button className='consult' onClick={() => handleConsult(recipeId)}>Consulter la recette</button>
                            </>
                        ) : (
                            <p>Chargement des détails...</p>
                        )}
                    </div>
                ))
            ) : (
                <p>Aucune recette n'a été trouvée. Réessayez votre recherche ou bien saisissez un autre terme !</p>
            )}
        </div>
    );
};

export default RecipeList;
