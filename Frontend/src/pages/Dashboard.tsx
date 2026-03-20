import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventAPI } from '../services/api';
import type { Event, EventInvitation } from '../types';

const statusLabel: Record<string, string> = {
    planning: 'En planification',
    voting: 'Vote en cours',
    confirmed: 'Confirmé',
    cancelled: 'Annulé',
};

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [invitations, setInvitations] = useState<EventInvitation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setError('');
        try {
            const [eventsRes, invitationsRes] = await Promise.all([
                eventAPI.getEvents(),
                eventAPI.getPendingInvitations(),
            ]);
            setEvents(eventsRes.data);
            setInvitations(invitationsRes.data);
        } catch {
            setError('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    const handleInvitationResponse = async (
        invitationId: string,
        action: 'accepted' | 'declined'
    ) => {
        try {
            await eventAPI.respondToInvitation(invitationId, action);
            loadData();
        } catch {
            setError("Erreur lors de la réponse à l'invitation");
        }
    };

    if (loading) {
        return <div className="loading">Chargement...</div>;
    }

    const confirmedCount = events.filter((e) => e.status === 'confirmed').length;
    const totalParticipants = events.reduce((acc, e) => acc + e.participants.length, 0);

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <h1>Tableau de bord de {user?.username} </h1>
                <Link to="/events/create" className="btn btn-primary">
                    + Créer un événement
                </Link>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-number">{events.length}</span>
                    <span className="stat-label">Événements</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">{invitations.length}</span>
                    <span className="stat-label">Invitations en attente</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">{confirmedCount}</span>
                    <span className="stat-label">Événements confirmés</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">{totalParticipants}</span>
                    <span className="stat-label">Total participants</span>
                </div>
            </div>

            {/* Pending invitations */}
            {invitations.length > 0 && (
                <section className="section">
                    <h2 className="section-title">
                        Invitations en attente ({invitations.length})
                    </h2>
                    <div className="list">
                        {invitations.map((invitation) => (
                            <div key={invitation._id} className="list-item invitation-item">
                                <div className="invitation-info">
                                    <p className="invitation-event-title">
                                        {invitation.event.title}
                                    </p>
                                    <p className="text-muted">
                                        Invité par {invitation.invitedBy.username} &bull;{' '}
                                        {new Date(invitation.event.startDateRange).toLocaleDateString('fr-FR')}{' '}
                                        — {new Date(invitation.event.endDateRange).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                                <div className="invitation-actions">
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() =>
                                            handleInvitationResponse(invitation._id, 'accepted')
                                        }
                                    >
                                        Accepter
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() =>
                                            handleInvitationResponse(invitation._id, 'declined')
                                        }
                                    >
                                        Refuser
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Recent events */}
            <section className="section">
                <div className="section-header">
                    <h2 className="section-title">Mes événements récents</h2>
                    {events.length > 4 && (
                        <Link to="/events" className="btn btn-secondary btn-sm">
                            Voir tout
                        </Link>
                    )}
                </div>

                {events.length === 0 ? (
                    <div className="empty-state">
                        <p>Vous n'avez pas encore d'événements.</p>
                        <Link to="/events/create" className="btn btn-primary">
                            Créer mon premier événement
                        </Link>
                    </div>
                ) : (
                    <div className="events-grid">
                        {events.slice(0, 4).map((event) => (
                            <Link
                                to={`/events/${event._id}`}
                                key={event._id}
                                className="event-card"
                            >
                                <div className={`badge badge-${event.status}`}>
                                    {statusLabel[event.status] ?? event.status}
                                </div>
                                <h3 className="event-card-title">{event.title}</h3>
                                {event.description && (
                                    <p className="event-card-description">{event.description}</p>
                                )}
                                <div className="event-card-meta">
                                    <span>
                                        {new Date(event.startDateRange).toLocaleDateString('fr-FR')}{' '}
                                        — {new Date(event.endDateRange).toLocaleDateString('fr-FR')}
                                    </span>
                                    <span>{event.participants.length} participant(s)</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Dashboard;