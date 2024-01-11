import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
const env = import.meta.env;

const Favorites = ({}) => {
    const [favorites, setFavorites] = useState([]);
    let navigate = useNavigate()

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/favorites`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                setFavorites(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des favoris :", error);
            }
        };

        fetchFavorites();
    }, []);

    function handleConsult(recipeId) {
        navigate(`/recipe/${recipeId}`)
    }

    return (
        <>
            <main>
                <div>
                    <h1>Mes recettes favorites</h1>
                    <div className="recipe-list">
                        {favorites.length > 0 ? (
                            favorites.map((favorite, index) => (
                                <div key={index} className="recipe">
                                    <h2>{favorite.Recipe.name}</h2>
                                    <p>{favorite.Recipe.description}</p>
                                    <button className="consult" onClick={() => handleConsult(favorite.recipeId)}>Consulter la recette</button>
                                    <button className="favorite-button" onClick={() => handleFavorite(favorite.recipeId)}>
                                    ❤️
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>Aucune recette favorite n'a été trouvée.</p>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};

export default Favorites;
