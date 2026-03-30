import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventAPI } from '../services/api';
import type { Event } from '../types';

type StatusFilter = 'all' | 'planning' | 'voting' | 'confirmed' | 'cancelled';

const statusLabel: Record<string, string> = {
    planning: 'En planification',
    voting: 'Vote en cours',
    confirmed: 'Confirmé',
    cancelled: 'Annulé',
};

const Events: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState<StatusFilter>('all');

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        setError('');
        try {
            const { data } = await eventAPI.getEvents();
            setEvents(data);
        } catch {
            setError('Erreur lors du chargement des événements');
        } finally {
            setLoading(false);
        }
    };

    const filteredEvents =
        filter === 'all' ? events : events.filter((e) => e.status === filter);

    if (loading) {
        return <div className="loading">Chargement...</div>;
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Mes événements</h1>
                <Link to="/events/create" className="btn btn-primary">
                    + Créer un événement
                </Link>
            </div>

            {error && <div className="alert alert-error">{error}</div>}


            <div className="filter-bar">
                {(['all', 'planning', 'voting', 'confirmed', 'cancelled'] as StatusFilter[]).map(
                    (s) => (
                        <button
                            key={s}
                            className={`btn${filter === s ? ' active' : ''}`}
                            onClick={() => setFilter(s)}
                        >
                            {s === 'all'
                                ? `Tous (${events.length})`
                                : `${statusLabel[s]} (${events.filter((e) => e.status === s).length})`}
                        </button>
                    )
                )}
            </div>

            {/* Events list */}
            {filteredEvents.length === 0 ? (
                <div className="empty-state">
                    <p>
                        {filter === 'all'
                            ? "Vous n'avez pas encore d'événements."
                            : 'Aucun événement pour ce filtre.'}
                    </p>
                    {filter === 'all' && (
                        <Link to="/events/create" className="btn btn-primary">
                            Créer mon premier événement
                        </Link>
                    )}
                </div>
            ) : (
                <div className="events-grid">
                    {filteredEvents.map((event) => (
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
                            {event.finalDate && (
                                <div className="event-card-final-date">
                                    Date retenue :{' '}
                                    {new Date(event.finalDate).toLocaleDateString('fr-FR')}
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Events;