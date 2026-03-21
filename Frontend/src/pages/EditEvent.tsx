import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventAPI } from '../services/api';
import type { Event } from '../types';

const EditEvent: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDateRange, setStartDateRange] = useState('');
    const [endDateRange, setEndDateRange] = useState('');
    const [status, setStatus] = useState<Event['status']>('planning');
    const [finalDate, setFinalDate] = useState('');

    useEffect(() => {
        if (id) loadEvent(id);
    }, [id]);

    const loadEvent = async (eventId: string) => {
        try {
            const { data } = await eventAPI.getEventById(eventId);
            const event: Event = data;

            // Check creator
            const userData = user as any;
            const userId = userData?._id || userData?.id;
            const creatorData = event.creator as any;
            const creatorId = creatorData?._id || creatorData?.id;

            if (userId !== creatorId) {
                navigate(`/events/${eventId}`);
                return;
            }

            setTitle(event.title);
            setDescription(event.description ?? '');
            setStartDateRange(event.startDateRange.split('T')[0]);
            setEndDateRange(event.endDateRange.split('T')[0]);
            setStatus(event.status);
            setFinalDate(event.finalDate ? event.finalDate.split('T')[0] : '');
        } catch {
            setError('Événement introuvable');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Le titre est requis');
            return;
        }
        if (new Date(startDateRange) >= new Date(endDateRange)) {
            setError('La date de début doit être antérieure à la date de fin');
            return;
        }

        setSaving(true);
        try {
            await eventAPI.updateEvent(id!, {
                title: title.trim(),
                description: description.trim(),
                startDateRange,
                endDateRange,
                status,
                finalDate: finalDate || undefined,
            });
            navigate(`/events/${id}`);
        } catch (err: any) {
            setError(err.response?.data?.message || "Erreur lors de la sauvegarde");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading">Chargement...</div>;

    return (
        <div className="page-container page-narrow">
            <div className="page-header">
                <div>
                    <Link to={`/events/${id}`} className="back-link">
                        ← Détails de l'événement
                    </Link>
                    <h1>Modifier l'événement</h1>
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} noValidate className="form-card">
                <div className="form-group">
                    <label htmlFor="title">Titre *</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        maxLength={100}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="startDateRange">Date de début *</label>
                        <input
                            id="startDateRange"
                            type="date"
                            value={startDateRange}
                            onChange={(e) => setStartDateRange(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="endDateRange">Date de fin *</label>
                        <input
                            id="endDateRange"
                            type="date"
                            value={endDateRange}
                            onChange={(e) => setEndDateRange(e.target.value)}
                            required
                            min={startDateRange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="status">Statut</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as Event['status'])}
                    >
                        <option value="planning">En planification</option>
                        <option value="voting">Vote en cours</option>
                        <option value="confirmed">Confirmé</option>
                        <option value="cancelled">Annulé</option>
                    </select>
                </div>

                {status === 'confirmed' && (
                    <div className="form-group">
                        <label htmlFor="finalDate">Date retenue</label>
                        <input
                            id="finalDate"
                            type="date"
                            value={finalDate}
                            onChange={(e) => setFinalDate(e.target.value)}
                            min={startDateRange}
                            max={endDateRange}
                        />
                    </div>
                )}

                <div className="form-actions">
                    <Link to={`/events/${id}`} className="btn btn-secondary">
                        Annuler
                    </Link>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditEvent;