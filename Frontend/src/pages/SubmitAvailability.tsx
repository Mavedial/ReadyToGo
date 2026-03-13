import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { eventAPI, availabilityAPI } from '../services/api';
import type { Event } from '../types';
import Calendar from '../components/Calendar';

const SubmitAvailability: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [event, setEvent] = useState<Event | null>(null);
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (id) loadData(id);
    }, [id]);

    const loadData = async (eventId: string) => {
        setError('');
        try {
            const [eventRes, myAvailRes] = await Promise.allSettled([
                eventAPI.getEventById(eventId),
                availabilityAPI.getMyAvailability(eventId),
            ]);

            if (eventRes.status === 'fulfilled') {
                setEvent(eventRes.value.data);
            } else {
                setError('Événement introuvable');
                return;
            }

            if (myAvailRes.status === 'fulfilled' && myAvailRes.value.data?.availableDates) {
                const existing: Date[] = myAvailRes.value.data.availableDates.map(
                    (d: string) => new Date(d)
                );
                setSelectedDates(existing);
            }
        } catch {
            setError('Erreur lors du chargement');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!event) return;
        setError('');
        setSuccess('');
        setSubmitting(true);

        try {
            const dateStrings = selectedDates.map((d) => d.toISOString());
            await availabilityAPI.submitAvailability(event._id, dateStrings);
            setSuccess('Disponibilités enregistrées avec succès !');
            setTimeout(() => navigate(`/events/${event._id}`), 1500);
        } catch {
            setError("Erreur lors de l'enregistrement");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading">Chargement...</div>;
    if (error && !event)
        return (
            <div className="page-container">
                <div className="alert alert-error">{error}</div>
                <Link to="/events" className="btn btn-secondary">
                    Retour aux événements
                </Link>
            </div>
        );
    if (!event) return null;

    return (
        <div className="page-container page-narrow">
            <div className="page-header">
                <div>
                    <Link to={`/events/${event._id}`} className="back-link">
                        ← {event.title}
                    </Link>
                    <h1>Mes disponibilités</h1>
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="card">
                <p className="text-muted">
                    Sélectionnez les dates auxquelles vous êtes disponible entre le{' '}
                    <strong>
                        {new Date(event.startDateRange).toLocaleDateString('fr-FR')}
                    </strong>{' '}
                    et le{' '}
                    <strong>
                        {new Date(event.endDateRange).toLocaleDateString('fr-FR')}
                    </strong>
                    .
                </p>

                <form onSubmit={handleSubmit}>
                    <Calendar
                        startDate={new Date(event.startDateRange)}
                        endDate={new Date(event.endDateRange)}
                        selectedDates={selectedDates}
                        onDatesChange={setSelectedDates}
                    />

                    <div className="form-actions" style={{ marginTop: '1.5rem' }}>
                        <Link
                            to={`/events/${event._id}`}
                            className="btn btn-secondary"
                        >
                            Annuler
                        </Link>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            {submitting
                                ? 'Enregistrement...'
                                : `Enregistrer (${selectedDates.length} date(s))`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubmitAvailability;