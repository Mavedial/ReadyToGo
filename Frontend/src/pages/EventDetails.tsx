import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventAPI, availabilityAPI } from '../services/api';
import { Event, Availability } from '../types';
import { useAuth } from '../context/AuthContext';

const EventDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [event, setEvent] = useState<Event | null>(null);
    const [availabilities, setAvailabilities] = useState<Availability[]>([]);
    const [loading, setLoading] = useState(true);
    const [calculating, setCalculating] = useState(false);

    useEffect(() => {
        if (id) {
            loadEventDetails();
        }
    }, [id]);

    const loadEventDetails = async () => {
        try {
            const [eventRes, availRes] = await Promise.all([
                eventAPI.getEventById(id!),
                availabilityAPI.getEventAvailabilities(id!)
            ]);
            setEvent(eventRes.data);
            setAvailabilities(availRes.data);
        } catch (error) {
            console.error('Erreur chargement événement:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCalculateBestDate = async () => {
        setCalculating(true);
        try {
            await availabilityAPI.calculateBestDate(id!);
            await loadEventDetails();
            alert('La meilleure date a été calculée ! 🎉');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Erreur lors du calcul');
        } finally {
            setCalculating(false);
        }
    };

    const handleDeleteEvent = async () => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
            return;
        }

        try {
            await eventAPI.deleteEvent(id!);
            navigate('/events');
        } catch (error) {
            alert('Erreur lors de la suppression');
        }
    };

    if (loading) {
        return <div className="loading">Chargement...</div>;
    }

    if (!event) {
        return <div className="error-page">Événement non trouvé</div>;
    }

    const isCreator = event.creator.id === user?.id;
    const isParticipant = event.participants.some(p => p.id === user?.id);
    const hasSubmittedAvailability = availabilities.some(a => a.user.id === user?.id);

    return (
        <div className="page-container">
            {/* Header */}
            <div className="event-details-header">
                <div>
                    <div className={`event-status status-${event.status}`}>
                        {event.status}
                    </div>
                    <h1>{event.title}</h1>
                    <p className="event-creator">
                        Créé par <strong>{event.creator.username}</strong>
                    </p>
                </div>

                {isCreator && (
                    <div className="event-actions">
                        <Link to={`/events/${id}/edit`} className="btn-secondary">
                            ✏️ Modifier
                        </Link>
                        <button onClick={handleDeleteEvent} className="btn-danger">
                            🗑️ Supprimer
                        </button>
                    </div>
                )}
            </div>

            {/* Description */}
            {event.description && (
                <div className="section">
                    <h2>Description</h2>
                    <p>{event.description}</p>
                </div>
            )}

            {/* Informations */}
            <div className="section">
                <h2>📅 Informations</h2>
                <div className="info-grid">
                    <div className="info-card">
                        <span className="info-label">Période proposée</span>
                        <span className="info-value">
                            {new Date(event.startDateRange).toLocaleDateString()} -
                            {new Date(event.endDateRange).toLocaleDateString()}
                        </span>
                    </div>

                    {event.finalDate && (
                        <div className="info-card highlighted">
                            <span className="info-label">🎯 Date choisie</span>
                            <span className="info-value">
                                {new Date(event.finalDate).toLocaleDateString()}
                            </span>
                        </div>
                    )}

                    <div className="info-card">
                        <span className="info-label">Participants</span>
                        <span className="info-value">{event.participants.length}</span>
                    </div>

                    <div className="info-card">
                        <span className="info-label">Disponibilités soumises</span>
                        <span className="info-value">{availabilities.length}</span>
                    </div>
                </div>
            </div>

            {/* Participants */}
            <div className="section">
                <h2>👥 Participants ({event.participants.length})</h2>
                <div className="participants-list">
                    {event.participants.map((participant) => (
                        <div key={participant.id} className="participant-chip">
                            <span>👤 {participant.username}</span>
                            {participant.id === event.creator.id && (
                                <span className="badge">Créateur</span>
                            )}
                            {availabilities.some(a => a.user.id === participant.id) && (
                                <span className="badge success">✓ Dispo soumises</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions disponibilités */}
            {isParticipant && event.status === 'planning' && (
                <div className="section">
                    <h2>🗓️ Vos disponibilités</h2>
                    {hasSubmittedAvailability ? (
                        <div className="success-message">
                            ✓ Vous avez déjà soumis vos disponibilités
                            <Link to={`/events/${id}/availability`} className="btn-secondary">
                                Modifier mes disponibilités
                            </Link>
                        </div>
                    ) : (
                        <div className="warning-message">
                            ⚠️ Vous n'avez pas encore soumis vos disponibilités
                            <Link to={`/events/${id}/availability`} className="btn-primary">
                                Soumettre mes disponibilités
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {/* Calculer la meilleure date (créateur seulement) */}
            {isCreator && event.status === 'planning' && availabilities.length > 0 && (
                <div className="section">
                    <h2>🤖 Calculer la meilleure date</h2>
                    <p>
                        {availabilities.length}/{event.participants.length} participants
                        ont soumis leurs disponibilités.
                    </p>
                    <button
                        onClick={handleCalculateBestDate}
                        disabled={calculating}
                        className="btn-primary"
                    >
                        {calculating ? 'Calcul en cours...' : '🎯 Calculer la meilleure date'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default EventDetails;