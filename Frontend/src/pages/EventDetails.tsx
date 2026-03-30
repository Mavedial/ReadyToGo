import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventAPI, availabilityAPI, userAPI } from '../services/api';
import type { Event, User } from '../types';

const statusLabel: Record<string, string> = {
    planning: 'En planification',
    voting: 'Vote en cours',
    confirmed: 'Confirmé',
    cancelled: 'Annulé',
};

const EventDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionError, setActionError] = useState('');
    const [bestDate, setBestDate] = useState<string | null>(null);
    const [calculatingDate, setCalculatingDate] = useState(false);

    // Invite users
    const [inviteQuery, setInviteQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [searching, setSearching] = useState(false);
    const [inviting, setInviting] = useState(false);

    useEffect(() => {
        if (id) loadEvent(id);
    }, [id]);

    const loadEvent = async (eventId: string) => {
        setError('');
        try {
            const { data } = await eventAPI.getEventById(eventId);
            setEvent(data);
        } catch {
            setError('Événement introuvable ou accès refusé');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!event || !window.confirm('Supprimer cet événement définitivement ?')) return;
        try {
            await eventAPI.deleteEvent(event._id);
            navigate('/events');
        } catch {
            setActionError('Erreur lors de la suppression');
        }
    };

    const handleLeaveEvent = async () => {
        if (!event || !window.confirm('Êtes-vous sûr de vouloir quitter cet événement ?')) return;
        try {
            await eventAPI.leaveEvent(event._id);
            navigate('/events');
        } catch {
            setActionError('Erreur lors de la suppression de l\'événement');
        }
    };

    const handleSearchUsers = async () => {
        if (!inviteQuery.trim()) return;
        setSearching(true);
        try {
            const { data } = await userAPI.searchUsers(inviteQuery.trim());
            setSearchResults(data);
        } catch {
            setActionError('Erreur lors de la recherche');
        } finally {
            setSearching(false);
        }
    };

    const handleInvite = async (userId: string) => {
        if (!event) return;
        setInviting(true);
        try {
            await eventAPI.inviteUsers(event._id, [userId]);
            setSearchResults([]);
            setInviteQuery('');
            loadEvent(event._id);
        } catch {
            setActionError("Erreur lors de l'invitation");
        } finally {
            setInviting(false);
        }
    };

    const handleCalculateBestDate = async () => {
        if (!event) return;
        setCalculatingDate(true);
        setBestDate(null);
        try {
            const { data } = await availabilityAPI.calculateBestDate(event._id);
            setBestDate(data.bestDate ?? null);
        } catch {
            setActionError('Erreur lors du calcul de la meilleure date');
        } finally {
            setCalculatingDate(false);
        }
    };

    if (loading) return <div className="loading">Chargement...</div>;
    if (error)
        return (
            <div className="page-container">
                <div className="alert alert-error">{error}</div>
                <Link to="/events" className="btn btn-secondary">
                    Retour aux événements
                </Link>
            </div>
        );
    if (!event) return null;

    const creatorData = event.creator as any;
    const creatorId = creatorData?._id || creatorData?.id;

    const userData = user as any;
    const userId = userData?._id || userData?.id;

    const isCreator = userId === creatorId;
    const alreadyParticipant = event.participants.some(
        (p) => (p as any)._id === user?.id || p.id === user?.id
    );

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <div>
                    <Link to="/events" className="back-link">
                        ← Événements
                    </Link>
                    <h1>{event.title}</h1>
                </div>
                {isCreator && (
                    <div className="page-header-actions">
                        <Link
                            to={`/events/${event._id}/edit`}
                            className="btn btn-secondary"
                        >
                            Modifier
                        </Link>
                        <button className="btn btn-danger" onClick={handleDelete}>
                            Supprimer
                        </button>
                    </div>
                )}
            </div>

            {actionError && <div className="alert alert-error">{actionError}</div>}

            <div className="detail-grid">
                {/* Main */}
                <div className="detail-main">
                    {/* General info */}
                    <div className="card">
                        <h2 className="card-title">Informations</h2>
                        <dl className="detail-list">
                            <div className="detail-row">
                                <dt className="detail-label">Statut</dt>
                                <dd>
                                    <span className={`badge badge-${event.status}`}>
                                        {statusLabel[event.status] ?? event.status}
                                    </span>
                                </dd>
                            </div>
                            {event.description && (
                                <div className="detail-row">
                                    <dt className="detail-label">Description</dt>
                                    <dd>{event.description}</dd>
                                </div>
                            )}
                            <div className="detail-row">
                                <dt className="detail-label">Période</dt>
                                <dd>
                                    {new Date(event.startDateRange).toLocaleDateString('fr-FR')}{' '}
                                    —{' '}
                                    {new Date(event.endDateRange).toLocaleDateString('fr-FR')}
                                </dd>
                            </div>
                            {event.finalDate && (
                                <div className="detail-row">
                                    <dt className="detail-label">Date retenue</dt>
                                    <dd className="text-success">
                                        {new Date(event.finalDate).toLocaleDateString('fr-FR')}
                                    </dd>
                                </div>
                            )}
                            <div className="detail-row">
                                <dt className="detail-label">Organisateur</dt>
                                <dd>{event.creator?.username ?? 'Inconnu'}</dd>
                            </div>
                        </dl>
                    </div>

                    {/* Participants */}
                    <div className="card">
                        <h2 className="card-title">
                            Participants ({event.participants.length})
                        </h2>
                        {event.participants.length === 0 ? (
                            <p className="text-muted">Aucun participant pour l'instant</p>
                        ) : (
                            <ul className="user-list">
                                {event.participants.map((p) => (
                                    <li
                                        key={(p as any)._id ?? p.id}
                                        className="user-list-item"
                                    >
                                        {p.username}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Invités */}
                    {event.invitedUsers.length > 0 && (
                        <div className="card">
                            <h2 className="card-title">
                                Invités ({event.invitedUsers.length})
                            </h2>
                            <ul className="user-list">
                                {event.invitedUsers.map((u) => (
                                    <li
                                        key={(u as any)._id ?? u.id}
                                        className="user-list-item text-muted"
                                    >
                                        {u.username}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="detail-sidebar">
                    {/* Availability */}
                    {alreadyParticipant && event.status !== 'cancelled' && (
                        <div className="card">
                            <h2 className="card-title">Mes disponibilités</h2>
                            <p className="text-muted">
                                Indiquez les dates où vous êtes disponible.
                            </p>
                            <Link
                                to={`/events/${event._id}/availability`}
                                className="btn btn-primary btn-block"
                            >
                                Soumettre mes disponibilités
                            </Link>
                        </div>
                    )}
                    {alreadyParticipant && !isCreator && event.status !== 'cancelled' && (
                        <div className="card">
                            <button
                                className="btn btn-danger btn-block"
                                onClick={handleLeaveEvent}
                            >
                                Quitter l'événement
                            </button>
                        </div>
                    )}

                    {/* Calculate best date */}
                    {isCreator &&
                        event.status !== 'confirmed' &&
                        event.status !== 'cancelled' && (
                            <div className="card">
                                <h2 className="card-title">Meilleure date</h2>
                                <p className="text-muted">
                                    Calcule la date optimale selon les disponibilités.
                                </p>
                                <button
                                    className="btn btn-secondary btn-block"
                                    onClick={handleCalculateBestDate}
                                    disabled={calculatingDate}
                                >
                                    {calculatingDate ? 'Calcul...' : 'Calculer'}
                                </button>
                                {bestDate && (
                                    <p className="text-success" style={{ marginTop: '0.75rem' }}>
                                        Meilleure date :{' '}
                                        {new Date(bestDate).toLocaleDateString('fr-FR')}
                                    </p>
                                )}
                            </div>
                        )}

                    {/* Invite users */}
                    {isCreator && (
                        <div className="card">
                            <h2 className="card-title">Inviter</h2>
                            <div className="search-bar">
                                <input
                                    type="text"
                                    placeholder="Rechercher un utilisateur..."
                                    value={inviteQuery}
                                    onChange={(e) => setInviteQuery(e.target.value)}
                                    onKeyDown={(e) =>
                                        e.key === 'Enter' && handleSearchUsers()
                                    }
                                />
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={handleSearchUsers}
                                    disabled={searching}
                                >
                                    {searching ? '...' : 'Chercher'}
                                </button>
                            </div>
                            {searchResults.length > 0 && (
                                <ul className="search-results">
                                    {searchResults.map((u) => {
                                        const userId = (u as any)._id || u.id;
                                        return (
                                            <li key={userId} className="search-result-item">
                                                <span>{u.username}</span>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => handleInvite(userId)}
                                                    disabled={inviting}
                                                >
                                                    Inviter
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventDetails;