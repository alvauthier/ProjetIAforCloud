import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import { FaHeart } from 'react-icons/fa';
const env = import.meta.env;

const Favorites = ({}) => {
    const [favorites, setFavorites] = useState([]);
    let navigate = useNavigate();
    const [reload, setReload] = useState(false);

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
    }, [reload]);

    function handleConsult(recipeId) {
        navigate(`/recipe/${recipeId}`)
    }

    const removeFavorite = async (recipeId) => {
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
                setReload(!reload);
            } else {
                console.error('Erreur lors de l\'ajout de la restriction');
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la restriction:', error);
        }
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
                                    <button className="favorite-button" onClick={() => removeFavorite(favorite.recipeId)}>
                                        <FaHeart style={{ color: 'red' }} size={25} />
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
