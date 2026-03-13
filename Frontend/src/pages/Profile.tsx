import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const Profile: React.FC = () => {
    const { user, logout } = useAuth();
    const [username, setUsername] = useState(user?.username ?? '');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user) setUsername(user.username);
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!username.trim()) {
            setError("Le nom d'utilisateur est requis");
            return;
        }
        if (username.length > 20) {
            setError("Le nom d'utilisateur ne peut pas dépasser 20 caractères");
            return;
        }

        setSaving(true);
        try {
            await userAPI.updateProfile({ username: username.trim() });
            setSuccess('Profil mis à jour avec succès !');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="page-container page-narrow">
            <div className="page-header">
                <h1>Mon profil</h1>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Profile info */}
            <div className="card">
                <h2 className="card-title">Informations du compte</h2>
                <dl className="detail-list">
                    <div className="detail-row">
                        <dt className="detail-label">Rôle</dt>
                        <dd>
                            <span className={`badge badge-role-${user?.role ?? 'user'}`}>
                                {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                            </span>
                        </dd>
                    </div>
                    <div className="detail-row">
                        <dt className="detail-label">Membre depuis</dt>
                        <dd>
                            {user?.createdAt
                                ? new Date(user.createdAt).toLocaleDateString('fr-FR')
                                : '—'}
                        </dd>
                    </div>
                </dl>
            </div>

            {/* Edit form */}
            <div className="card">
                <h2 className="card-title">Modifier mon profil</h2>
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
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={saving}
                        >
                            {saving ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Danger zone */}
            <div className="card card-danger">
                <h2 className="card-title">Zone de danger</h2>
                <p className="text-muted">
                    Se déconnecter de votre compte sur cet appareil.
                </p>
                <button className="btn btn-danger" onClick={logout}>
                    Se déconnecter
                </button>
            </div>
        </div>
    );
};

export default Profile;