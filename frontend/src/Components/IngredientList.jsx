import React, { useState } from 'react';
const env = import.meta.env;

const RecipeSearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = async () => {
        // Appeler la fonction onSearch avec le terme de recherche en argument

    // Envoi du terme de recherche au backend avec fetch
    await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchTerm }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Réponse du backend :', data);
        })
        .catch(error => {
            console.error('Erreur lors de la requête vers le backend :', error);
        }
    );
};

    const handleKeyPress = (event) => {
        // Si la touche Entrée est pressée, déclencher la recherche
        if (event.key === 'Enter') {
        handleSearch();
        }
    };

    return (
        <div className="recipe-search-bar">
        <input
            type="text"
            placeholder="Rechercher une recette..."
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
        />
        <button onClick={handleSearch}>Rechercher</button>
        </div>
    );
};

export default RecipeSearchBar;
