import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const Profile: React.FC = () => {
    const { user, logout, updateUserProfile, refreshProfile } = useAuth();
    const [username, setUsername] = useState(user?.username ?? '')
    const [email, setEmail] = useState(user?.email ?? '');
    const [newEmail, setNewEmail] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [emailSuccess, setEmailSuccess] = useState('');

    useEffect(() => {
        if (user) {setUsername(user.username);
        setEmail(user.email);}
    }, [user]);

    const isValidEmail = (emailToValidate: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(emailToValidate);
    };

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
            const response = await userAPI.updateProfile({ username: username.trim() });
            if (updateUserProfile && response.data.user) {
                updateUserProfile(response.data.user);
            }            setSuccess('Profil mis à jour avec succès !');
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

    const handleEmailChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError('');
        setEmailSuccess('');

        if (!newEmail.trim()) {
            setEmailError('Veuillez entrer une nouvelle adresse email');
            return;
        }

        if (!isValidEmail(newEmail)) {
            setEmailError('Veuillez entrer une adresse email valide');
            return;
        }

        if (newEmail === email) {
            setEmailError('La nouvelle adresse email est la même que l\'actuelle');
            return;
        }

        setSaving(true);
        try {
            const response = await userAPI.updateProfile({ email: newEmail.trim() });
            setEmail(newEmail);
            setNewEmail('');
            setIsEditingEmail(false);

            if (updateUserProfile && response.data.user) {
                updateUserProfile(response.data.user);
            }

            if (refreshProfile) {
                await refreshProfile();
            }

            setEmailSuccess('Email mis à jour avec succès !');
        } catch (err: any) {
            setEmailError(
                err.response?.data?.message || 'Erreur lors de la mise à jour de l\'email'
            );
        } finally {
            setSaving(false);
        }
    };

    // Annuler l'édition d'email
    const handleCancelEmailEdit = () => {
        setIsEditingEmail(false);
        setNewEmail('');
        setEmailError('');
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
                        <dd>
                            {email}
                            <button
                                type="button"
                                className="btn btn-sm btn-secondary"
                                onClick={() => setIsEditingEmail(true)}
                                style={{ marginLeft: '10px' }}
                                disabled={isEditingEmail}
                            > Modifier
                            </button>
                        </dd>
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

            {/* Section Modification d'email */}
            {isEditingEmail && (
                <div className="card" style={{ backgroundColor: '#f0f8ff', borderLeft: '4px solid #007bff' }}>
                    <h3 className="card-title">Changer mon adresse email</h3>

                    {emailError && <div className="alert alert-error">{emailError}</div>}
                    {emailSuccess && <div className="alert alert-success">{emailSuccess}</div>}

                    <form onSubmit={handleEmailChange} noValidate>
                        <div className="form-group">
                            <label htmlFor="currentEmail">Email actuel</label>
                            <input
                                id="currentEmail"
                                type="email"
                                value={email}
                                disabled
                                style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="newEmail">Nouvelle adresse email</label>
                            <input
                                id="newEmail"
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="nouvelEmail@exemple.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={saving || !newEmail.trim()}
                            >
                                {saving ? 'Mise à jour...' : 'Confirmer le changement'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleCancelEmailEdit}
                                disabled={saving}
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            )}

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