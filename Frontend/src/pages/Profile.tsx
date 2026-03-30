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

    const handleDeleteAccount = async () => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
            return;
        }

        if (!window.confirm('Dernière confirmation : supprimer votre compte définitivement ?')) {
            return;
        }

        setSaving(true);
        setError('');
        try {
            await userAPI.deleteAccount();
            logout();
            window.location.href = '/login';
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de la suppression du compte');
            setSaving(false);
        }
    };

    const handleExportData = async () => {
        try {
            const { data } = await userAPI.exportUserData();
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `readytogo-data-${new Date().toISOString()}.json`;
            a.click();
        } catch (err: any) {
            setError('Erreur lors de l\'export');
        }
    };

    return (
        <div className="page-container page-narrow">
            <div className="page-header">
                <h1>Mon profil</h1>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="card">
                <h2 className="card-title">Informations du compte</h2>
                <dl className="detail-list">
                    <div className="detail-row">
                        <dt className="detail-label"><b>Email</b></dt>
                        <dd>{user?.email}</dd>
                    </div>
                    <div className="detail-row">
                        <dt className="detail-label"><b>Membre depuis</b></dt>
                        <dd><em>
                            {user?.createdAt
                                ? new Date(user.createdAt).toLocaleDateString('fr-FR')
                                : '—'}
                        </em></dd>
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
                    <button type="button" className="btn btn-secondary" onClick={handleExportData}>
                        Télécharger mes données
                    </button>
                </form>
            </div>

            <div className="card card-danger">
                <h2 className="card-title">Supprimer le compte</h2>
                <p className="text-muted">
                    <em>En cliquant sur ce bouton vous allez supprimez définitivement votre compte et toutes vos données.</em>
                </p>
                <button className="btn btn-danger" onClick={handleDeleteAccount} disabled={saving}>
                    {saving ? 'Suppression...' : 'Supprimer mon profil'}
                </button>
            </div>
        </div>
    );
};

export default Profile;