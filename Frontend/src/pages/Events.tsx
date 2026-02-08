import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventAPI } from '../services/api';
import { Event } from '../types';

const Events: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'planning' | 'confirmed'>('all');

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const { data } = await eventAPI.getEvents();
            setEvents(data);
        } catch (error) {
            console.error('Erreur chargement événements:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredEvents = events.filter(event => {
        if (filter === 'all') return true;
        return event.status === filter;
    });

    if (loading) {
        return <div className="loading">Chargement...</div>;
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>📅 Mes événements</h1>
                <Link to="/events/create" className="btn-primary">
                    ➕ Créer un événement
                </Link>
            </div>

            {/* Filtres */}
            <div className="filters">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Tous ({events.length})
                </button>
                <button
                    className={`filter-btn ${filter === 'planning' ? 'active' : ''}`}
                    onClick={() => setFilter('planning')}
                >
                    En planification ({events.filter(e => e.status === 'planning').length})
                </button>
                <button
                    className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
                    onClick={() => setFilter('confirmed')}
                >
                    Confirmés ({events.filter(e => e.status === 'confirmed').length})
                </button>
            </div>

            {/* Liste des événements */}
            {filteredEvents.length === 0 ? (
                <div className="empty-state">
                    <p>Aucun événement trouvé</p>
                    <Link to="/events/create" className="btn-secondary">
                        Créer mon premier événement
                    </Link>
                </div>
            ) : (
                <div className="events-grid">
                    {filteredEvents.map((event) => (
                        <Link
                            to={`/events/${event._id}`}
                            key={event._id}
                            className="event-card"
                        >
                            <div className={`event-status status-${event.status}`}>
                                {event.status}
                            </div>
                            <h3>{event.title}</h3>
                            <p className="event-description">{event.description}</p>

                            <div className="event-info">
                                <div className="info-item">
                                    <span className="info-label">Période :</span>
                                    <span>
                                        {new Date(event.startDateRange).toLocaleDateString()} -
                                        {new Date(event.endDateRange).toLocaleDateString()}
                                    </span>
                                </div>

                                {event.finalDate && (
                                    <div className="info-item highlighted">
                                        <span className="info-label">📅 Date choisie :</span>
                                        <span>{new Date(event.finalDate).toLocaleDateString()}</span>
                                    </div>
                                )}

                                <div className="info-item">
                                    <span className="info-label">👥 Participants :</span>
                                    <span>{event.participants.length}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Events;