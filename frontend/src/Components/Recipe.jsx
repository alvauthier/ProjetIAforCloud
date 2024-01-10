import React from 'react';

import SearchBar from './SearchBar';
import "@css/RecipeList.css";

function HomePage({ isConnected }) {
    return (
        <>
            <main>
                <h1>Bienvenue sur WeCook !</h1>
                {isConnected ? (
                    <>
                        <p>
                            Content de vous revoir ! Prêt à cuisiner de nouvelles recettes ?
                        </p>
                        <SearchBar />
                    </>
                ) : (
                    <>
                        <p>
                            WeCook vous permet de trouver des recettes de cuisine de façon intelligente en fonction de vos envies.
                            Vous souhaitez vous lancer ? Alors inscrivez-vous dès maintenant et enfilez votre tablier !

                            Inscription rapide et gratuite.
                        </p>
                    </>
                )}
            </main>
        </>
    );
}

export default HomePage;