import React, { useState } from 'react';
import '@css/Authentification.css';
import { Link, useNavigate } from 'react-router-dom';
// import jwt from 'jsonwebtoken';
const env = import.meta.env;

function Login({ handleConnect }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData(e.target);

        try {
            const result = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: data.get('email'),
                    password: data.get('password')
                })
            });
            console.log(result);
            const body = await result.json();
            console.log(body);
            if (!result.ok) {
                alert('Une erreur est survenue. Veuillez vérifier vos informations de connexion.');
                setLoading(false);
                return;
            }


            localStorage.setItem('token', body.token);
            handleConnect();
            navigate("/");
        } catch (error) {
            console.log(error);
            // alert('Une erreur est survenue lors de la tentative de connexion. Veuillez réessayer plus tard.');
            setLoading(false);
        }
    };

    return (
        <>
            <main className="authentification">
                <div className="login-signup">

                    <form className="login-signup__form" onSubmit={handleSubmit}>
                        <input type="email" id="email" name="email" placeholder="Email" autoComplete="email" required />
                        <input type="password" id="password" name="password" placeholder="Mot de passe" autoComplete="current-password" required/>
                        <div className="login-signup__form__submit">
                            <input type="submit" value={loading ? 'Connexion en cours...' : 'Se connecter'} disabled={loading} />
                            <p>Vous n’avez pas encore de compte ? <Link to="/signup">Inscrivez-vous</Link></p>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}

export default Login;
