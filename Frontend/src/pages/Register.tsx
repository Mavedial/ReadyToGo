import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [consentGiven, setConsentGiven] = useState(false);


    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères');
            return;
        }

        if (username.length > 20) {
            setError("Le nom d'utilisateur ne peut pas dépasser 20 caractères");
            return;
        }

        setLoading(true);
        if (!consentGiven) {
            setError('Vous devez accepter les conditions');
            return;
        }

        try {
            await register(username, email, password, consentGiven);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || "Erreur lors de l'inscription");
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">ReadyToGo</h1>
                <h2 className="auth-subtitle">Créer un compte</h2>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="username">Nom d'utilisateur</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            maxLength={20}
                            autoComplete="username"
                            placeholder="Max. 20 caractères"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            placeholder="votre@email.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            autoComplete="new-password"
                            placeholder="Min. 8 caractères"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                            placeholder="Répétez votre mot de passe"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Inscription en cours...' : "S'inscrire"}
                    </button>
                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={consentGiven}
                                onChange={(e) => setConsentGiven(e.target.checked)}
                                required
                            />
                            <span>
            J'accepte les{' '}
                                <a href="/terms" target="_blank" rel="noopener noreferrer">
                Conditions d'Utilisation
            </a>
                                {' '}et la{' '}
                                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                Politique de Confidentialité
            </a>
        </span>
                        </label>
                    </div>
                </form>

                <p className="auth-footer">
                    Déjà un compte ?{' '}
                    <Link to="/login">Se connecter</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;