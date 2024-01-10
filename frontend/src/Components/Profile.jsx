import React, { useState, useEffect } from "react";
import "@css/Authentification.css";
import { Link, useNavigate } from "react-router-dom";
const env = import.meta.env;

function Profile({ handleConnect }) {
    // const [ingredients, setIngredients] = useState([]);
    const [userId, setUserId] = useState(null);
    const [restrictionsUser, setRestrictionsUser] = useState([]);

    useEffect(() => {
        console.log("Début useEffect 1")
        const token = localStorage.getItem('token');

        if (token) {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace('-', '+').replace('_', '/');
            const valuesToken = JSON.parse(window.atob(base64));
            if (valuesToken.userId) {
                setUserId(valuesToken.userId);
            } else {
                console.error('Aucun userId trouvé dans le token');
            }
        } else {
            console.error('Aucun token trouvé dans le localStorage');
        }
        console.log("Fin useEffect 1");
    }, []);

    useEffect(() => {
        console.log("Début useEffect 2");
        const fetchData = async () => {
            try {
                const [restrictionsResponse] = await Promise.all([
                    userId && fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/restrictions/${userId}`),
                ]);

                const restrictionsData = userId ? await restrictionsResponse.json() : [];

                console.log('restrictionsData', restrictionsData);
                setRestrictionsUser(restrictionsData);

                // if (
                //     ingredientsData.ingredients &&
                //     Array.isArray(ingredientsData.ingredients)
                // ) {
                //     setIngredients(ingredientsData.ingredients);
                // } else {
                //     console.error(
                //         "La réponse ne contient pas la structure attendue :",
                //         ingredientsData
                //     );
                // }

                // if (Array.isArray(restrictionsData) && restrictionsData.length > 0) {
                //     const selectedIngredientNames = restrictionsData.map((restriction) => restriction.ingredient.name);
                //     setSelectedIngredients(selectedIngredientNames);
                //     setInitialSelectedIngredients(selectedIngredientNames);
                // } else {
                //     console.log('Aucune restriction enregistrée pour cet utilisateur.');
                // }
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        };

        fetchData();
        console.log("Fin useEffect 2");
    }, [userId]);

    // const handleIngredientSelection = (ingredientName) => {
    //     const updatedSelectedIngredients = [...selectedIngredients];

    //     const index = updatedSelectedIngredients.indexOf(ingredientName);

    //     if (index !== -1) {
    //         updatedSelectedIngredients.splice(index, 1);
    //     } else {
    //         updatedSelectedIngredients.push(ingredientName);
    //     }

    //     setSelectedIngredients(updatedSelectedIngredients);
    // };

    // const handleSaveRestrictions = async () => {
    //     console.log("Début handleSaveRestrictions");
    //     console.log('ingrédients sélectionnés :', selectedIngredients);
    //     try {
    //         const response = await fetch(
    //             `${env.VITE_URL}:${env.VITE_PORT_BACK}/restrictions/save/${userId}`,
    //             {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({
    //                     userId,
    //                     ingredientNames: selectedIngredients,
    //                 }),
    //             }
    //         );

    //         if (response.ok) {
    //             console.log("Restrictions enregistrées avec succès");
    //             setInitialSelectedIngredients(selectedIngredients);
    //             console.log('initialSelectedIngredients mis à jour',initialSelectedIngredients);
    //         } else {
    //             console.error("Échec de l'enregistrement des restrictions");
    //         }
    //     } catch (error) {
    //         console.error("Erreur lors de l'enregistrement des restrictions:", error);
    //     }

    //     console.log('selectedIngr',selectedIngredients);
    //     console.log('intialSelectedIngr',initialSelectedIngredients);
    //     const deselectedIngredientNames = initialSelectedIngredients.filter(
    //         (ingredient) => !selectedIngredients.includes(ingredient)
    //     );
    //     console.log('deselectedIngr',deselectedIngredientNames);

    //     if (deselectedIngredientNames.length > 0) {
    //         console.log('FONCTION DE SUPPRESSION DES RESTRICTIONS');
    //         try {
    //             const response = await fetch(
    //                 `${env.VITE_URL}:${env.VITE_PORT_BACK}/restrictions/delete/${userId}`, 
    //                 {
    //                     method: "DELETE",
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                     },
    //                     body: JSON.stringify({
    //                         userId,
    //                         ingredientNames: deselectedIngredientNames,
    //                     }),
    //                 }
    //             );

    //             if (response.status === 200) {
    //                 console.log('Restrictions supprimées avec succès');
    //             } else {
    //                 console.error('Erreur lors de la suppression des restrictions');
    //             }
    //         } catch (error) {
    //             console.error('Erreur lors de la suppression des restrictions:', error);
    //         }
    //     }
    // };

    const [newIngredient, setNewIngredient] = useState('');

    const handleIngredientDeletion = (ingredientName) => {
        // Supprimez l'ingrédient de la base de données et mettez à jour l'état
    };

    const handleIngredientAddition = async (e) => {
        e.preventDefault();
        // Ajoutez l'ingrédient à la base de données et mettez à jour l'état
        try {
            const response = await fetch(
                `${env.VITE_URL}:${env.VITE_PORT_BACK}/restrictions/add/${userId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId,
                        restriction: newIngredient,
                    }),
                }
            );

            if (response.status === 200) {
                // Mettre à jour l'état avec la nouvelle restriction
                setRestrictionsUser([...restrictionsUser, response.data.newRestriction]);
                setNewIngredient('');
            } else {
                console.error('Erreur lors de l\'ajout de la restriction');
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la restriction:', error);
        }

        setNewIngredient('');
    };

    return (
        <>
            <main>
                <div>
                    <h1>Gestion de vos restrictions alimentaires</h1>
                    <p>
                        Sélectionnez les ingrédients que vous souhaitez exclure de vos
                        recettes.
                    </p>
                    &nbsp;
                    <form onSubmit={handleIngredientAddition}>
                        <input type="text" value={newIngredient} onChange={e => setNewIngredient(e.target.value)} />
                        <button type="submit">Ajouter</button>
                    </form>
                    <form>
                        <ul>
                            {restrictionsUser.map((restriction) => (
                                <li key={restriction.id}>
                                    {restriction.name}
                                    <button
                                        type="button"
                                        onClick={() => handleIngredientDeletion(restriction.name)}
                                    >
                                        Supprimer
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </form>
                </div>
            </main>
        </>
    );
}

export default Profile;
