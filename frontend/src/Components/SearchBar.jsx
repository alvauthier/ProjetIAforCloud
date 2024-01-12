import React, { useState, useEffect, useMemo, useCallback } from 'react';
import '@css/SearchBar.css';
import RecipeList from './RecipeList';
const env = import.meta.env;

const RecipeSearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState(null);
    const [recipes, setRecipes] = useState([]);;

    const isSpeechRecognitionSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

    const speechRecognition = useMemo(() => {
        if (isSpeechRecognitionSupported) {
            return new window.webkitSpeechRecognition();
        } else {
            return null;
        }
    }, [isSpeechRecognitionSupported]);

    // const speechRecognition = useMemo(() => new window.webkitSpeechRecognition(), []);

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = async () => {
        console.log('Recherche de la recette :', searchTerm);
        await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/search`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                searchTerm,
            }),
            // body: JSON.stringify({
            //     userId,
            //     restrictionId: restrictionId,
            // }),
            })
            .then(response => response.json())
            .then(data => {
                const responseAI = JSON.parse(data.responseAI);
                console.log('Réponse du backend :', data);
                console.log('Réponse de l\'IA :', responseAI);
                setRecipes(responseAI.Recettes);
            })
            .catch(error => {
                console.error('Erreur lors de la requête vers le backend :', error);
            }
        );
    };

    const handleVocalButtonClick = () => {
        if (isSpeechRecognitionSupported) {
            if (isListening) {
                stopListening();
            } else {
                startListening();
            }
        } else {
            alert('La reconnaissance vocale n\'est pas supportée par votre navigateur.');
        }
    };

    const handleVocalSearch = async (searchValue) => {
        console.log('Recherche de la recette :', searchValue);
        await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/search`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ searchTerm: searchValue }),
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
        if (event.key === 'Enter') {
        handleSearch();
        }
    };

    useEffect(() => {
        speechRecognition.lang = 'fr-FR';
        speechRecognition.interimResults = true;

        const onResult = (event) => {
            setSearchTerm(event.results[event.resultIndex][0].transcript);
        };

        speechRecognition.addEventListener('result', onResult);

        return () => {
            speechRecognition.removeEventListener('result', onResult);
        };
    }, [speechRecognition]);

    // recognition.onresult = (event) => {
    //     // const searchValue = event.results[0][0].transcript;
    //     // setSearchTerm(searchValue);
    //     let searchValue = event.results[0][0].transcript;
    //     searchValue = searchValue.trim().replace(/\.$/, '');
    //     setSearchTerm(searchValue);
    //     handleVocalSearch(searchValue);
    // };

    useEffect(() => {
        if (isListening) {
            setSearchTerm('');
            speechRecognition.start();
        } else {
            speechRecognition.stop();
        }
    }, [isListening, speechRecognition]);

    // recognition.onstart = () => {
    //     setIsListening(true);
    // };

    // recognition.onend = () => {
    //     setIsListening(false);
    // };

    const startListening = useCallback(() => {
        setIsListening(true);
    }, []);

    const stopListening = useCallback(() => {
        setIsListening(false);
    }, []);

    // speechRecognition.onerror = (event) => {
    //     if (event.error === 'not-allowed') {
    //         setError('L\'accès au microphone a été refusé. Vous ne pouvez pas utiliser la reconnaissance vocale sans autoriser votre navigateur.');
    //     } else {
    //         setError('Une erreur s\'est produite lors de la reconnaissance vocale.');
    //     }
    // };

    // const handlePermissionReset = () => {
    //     alert('Pour réinitialiser les autorisations du microphone, allez dans les paramètres de votre navigateur, recherchez les paramètres de confidentialité ou de contenu, puis réinitialisez les autorisations du microphone pour ce site.');
    // };

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
        {isListening ? (
                <div>
                    <p className="microphone-button">Le micro est actuellement utilisé et le site vous écoute...</p>
                    <button onClick={handleVocalButtonClick}>&#9632; Arrêter la reconnaissance vocale</button>
                </div>
            ) : (
                <button onClick={handleVocalButtonClick}>&#127908; Démarrer la reconnaissance vocale</button>
            )}
            {/* {error && (
            <div>
                <p>{error}</p>
                <button onClick={handlePermissionReset}>Réinitialiser les autorisations du microphone</button>
            </div>
            )} */}
        <RecipeList recipes={recipes} />
        </div>
    );
};

export default RecipeSearchBar;
