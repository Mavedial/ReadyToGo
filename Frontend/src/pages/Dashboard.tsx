import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventAPI, friendAPI } from '../services/api';
import { Event, EventInvitation } from '../types';

const Dashboard = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [invitations, setInvitations] = useState<EventInvitation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [eventsRes, invitationsRes] = await Promise.all([
                eventAPI.getEvents(),
                eventAPI.getPendingInvitations(),
            ]);
            setEvents(eventsRes.data);
            setInvitations(invitationsRes.data);
        } catch (error) {
            console.error('Erreur chargement:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInvitationResponse = async (invitationId: string, action: 'accepted' | 'declined') => {
        try {
            await eventAPI.respondToInvitation(invitationId, action);
            loadData();
        } catch (error) {
            console.error('Erreur réponse invitation:', error);
        }
    };

    if (loading) {
        return <div className="loading">Chargement...</div>;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Bienvenue, {user?.username} ! 👋</h1>
                <Link to="/events/create" className="btn-primary">
                    ➕ Créer un événement
                </Link>
            </div>

            {invitations.length > 0 && (
                <section className="dashboard-section">
                    <h2>📩 Invitations en attente ({invitations.length})</h2>
                    <div className="invitations-list">
                        {invitations.map((invitation) => (
                            <div key={invitation._id} className="invitation-card">
                                <div className="invitation-info">
                                    <h3>{invitation.event.title}</h3>
                                    <p>Invité par : {invitation.invitedBy.username}</p>
                                    <p className="invitation-date">
                                        Du {new Date(invitation.event.startDateRange).toLocaleDateString()}
                                        {' au '}
                                        {new Date(invitation.event.endDateRange).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="invitation-actions">
                                    <button
                                        onClick={() => handleInvitationResponse(invitation._id, 'accepted')}
                                        className="btn-success"
                                    >
                                        ✓ Accepter
                                    </button>
                                    <button
                                        onClick={() => handleInvitationResponse(invitation._id, 'declined')}
                                        className="btn-danger"
                                    >
                                        ✗ Refuser
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="dashboard-section">
                <h2>📅 Mes événements ({events.length})</h2>
                {events.length === 0 ? (
                    <p className="empty-state">Aucun événement pour le moment.</p>
                ) : (
                    <div className="events-grid">
                        {events.slice(0, 6).map((event) => (
                            <Link to={`/events/${event._id}`} key={event._id} className="event-card">
                                <div className={`event-status status-${event.status}`}>
                                    {event.status}
                                </div>
                                <h3>{event.title}</h3>
                                <p>{event.description}</p>
                                <div className="event-meta">
                                    <span>👥 {event.participants.length} participants</span>
                                    {event.finalDate && (
                                        <span>📅 {new Date(event.finalDate).toLocaleDateString()}</span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                {events.length > 6 && (
                    <Link to="/events" className="btn-secondary">
                        Voir tous les événements →
                    </Link>
                )}
            </section>

            <section className="dashboard-stats">
                <div className="stat-card">
                    <h3>📅</h3>
                    <p className="stat-number">{events.length}</p>
                    <p>Événements</p>
                </div>
                <div className="stat-card">
                    <h3>👥</h3>
                    <p className="stat-number">{events.reduce((acc, e) => acc + e.participants.length, 0)}</p>
                    <p>Participants total</p>
                </div>
                <div className="stat-card">
                    <h3>✓</h3>
                    <p className="stat-number">
                        {events.filter(e => e.status === 'confirmed').length}
                    </p>
                    <p>Confirmés</p>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;