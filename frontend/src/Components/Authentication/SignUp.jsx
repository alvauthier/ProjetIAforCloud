import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@css/Authentification.css';
import { Link } from 'react-router-dom';
const env = import.meta.env;

function SignUp() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData(e.target);

        if (data.get('password') !== data.get('passwordConfirm')) {
            alert('Les mots de passe ne correspondent pas');
            setLoading(false);
            return;
        }

        try {
            const result = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.get('email'),
                    password: data.get('password'),
                }),
            });
            console.log(result);
            const body = await result.json();
            console.log(body);
            if (result.status === 422) {
                setError(body.violations[0].message + ' ' + body.violations[0].propertyPath);
            } else if (!result.ok) {
                setError('Une erreur est survenue');
            } else {
                navigate("/login");
            }
        } catch (error) {
            setError('Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <main className="authentification">
                <div className="login-signup">
                    <form className="login-signup__form" onSubmit={handleSubmit}>
                    <h2>
                        <Link to="/" className="logo">WeCook</Link>
                    </h2>
                        <p>Inscription</p>
                        <p><Link to="/">Retourner à l'accueil</Link></p>
                        {
                            error && <p className="error">{error}</p>
                        }
                        <input type="email" id="email" name="email" placeholder="Email" autoComplete="email" required></input>
                        <input type="password" id="password" name="password" placeholder="Mot de passe" autoComplete="current-password" required></input>
                        <input type="password" id="passwordConfirm" name="passwordConfirm" placeholder="Confirmation du mot de passe" autoComplete="confirm-password" required></input>
                        <div className="login-signup__form__submit">
                            <input type="submit" value="Inscription" disabled={loading}/>
                            <p>Vous avez déjà un compte ? <Link to="/login">Connectez-vous</Link></p>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default SignUp;