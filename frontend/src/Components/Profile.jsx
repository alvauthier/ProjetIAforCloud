import React, { useState, useEffect } from "react";
import "@css/Authentification.css";
import { Link, useNavigate } from "react-router-dom";
import { getUserIdFromToken } from '@services/getUserId';
const env = import.meta.env;

function Profile({ }) {
    const [userId, setUserId] = useState(null);
    const [restrictionsUser, setRestrictionsUser] = useState([]);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        const userId = getUserIdFromToken();
        setUserId(userId);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [restrictionsResponse] = await Promise.all([
                    userId && fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/restrictions/${userId}`),
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                ]);

                const restrictionsData = userId ? await restrictionsResponse.json() : [];

                console.log('restrictionsData', restrictionsData);
                setRestrictionsUser(restrictionsData);

            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        };

        fetchData();
    }, [userId, reload]);

    const [newRestriction, setNewRestriction] = useState('');

    const handleRestrictionDeletion = (restrictionId) => {
        // Supprimez l'ingrédient de la base de données et mettez à jour l'état
        try {
            fetch(
                `${env.VITE_URL}:${env.VITE_PORT_BACK}/restrictions/delete/${userId}/${restrictionId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId,
                        restrictionId: restrictionId,
                    }),
                }
            ).then(() => setReload(!reload));
        } catch (error) {
            console.error('Erreur lors de la suppression de la restriction:', error);
        }
    };

    const handleRestrictionAddition = async (e) => {
        e.preventDefault();
        // Ajoutez l'ingrédient à la base de données et mettez à jour l'état
        try {
            const response = await fetch(
                `${env.VITE_URL}:${env.VITE_PORT_BACK}/restrictions/add/${userId}`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        // userId,
                        restriction: newRestriction,
                    }),
                }
            );

            if (response.status === 200) {
                setNewRestriction('');
                setReload(!reload);
            } else {
                console.error('Erreur lors de l\'ajout de la restriction');
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la restriction:', error);
        }

        setNewRestriction('');
    };

    return (
        <>
            <main>
                <div>
                    <h1>Gestion de vos restrictions alimentaires</h1>
                    <p>
                        Saisissez les ingrédients, préférences alimentaires et intolérances que vous souhaitez exclure de vos
                        recettes.
                        Exemple : Fruits à coques, kiwi, gluten, etc.
                    </p>
                    &nbsp;
                    <form onSubmit={handleRestrictionAddition}>
                        <input type="text" value={newRestriction} onChange={e => setNewRestriction(e.target.value)} />
                        <button type="submit">Ajouter</button>
                    </form>
                    <form>
                        <ul>
                            {restrictionsUser.map((restriction) => (
                                <li key={restriction.id}>
                                    {restriction.name}
                                    <button
                                        type="button"
                                        onClick={() => handleRestrictionDeletion(restriction.id)}
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
