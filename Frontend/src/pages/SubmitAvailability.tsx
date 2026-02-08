import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventAPI, availabilityAPI } from '../services/api';
import { Event } from '../types';
import Calendar from '../components/Calendar';

const SubmitAvailability: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [event, setEvent] = useState<Event | null>(null);
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (id) {
            loadEvent();
            loadMyAvailability();
        }
    }, [id]);

    const loadEvent = async () => {
        try {
            const { data } = await eventAPI.getEventById(id!);
            setEvent(data);
        } catch (error) {
            console.error('Erreur chargement événement:', error);
        }
    };

    const loadMyAvailability = async () => {
        try {
            const { data } = await availabilityAPI.getMyAvailability(id!);
            setSelectedDates(data.availableDates.map((d: string) => new Date(d)));
        } catch (error) {
            // Pas encore de disponibilités soumises
            console.log('Aucune disponibilité existante');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (selectedDates.length === 0) {
            alert('Veuillez sélectionner au moins une date');
            return;
        }

        setSubmitting(true);
        try {
            await availabilityAPI.submitAvailability(
                id!,
                selectedDates.map(d => d.toISOString())
            );
            navigate(`/events/${id}`);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Erreur lors de la soumission');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="loading">Chargement...</div>;
    }

    if (!event) {
        return <div className="error-page">Événement non trouvé</div>;
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>🗓️ Mes disponibilités</h1>
                <p className="subtitle">Pour : {event.title}</p>
            </div>

            <Calendar
                startDate={new Date(event.startDateRange)}
                endDate={new Date(event.endDateRange)}
                selectedDates={selectedDates}
                onDatesChange={setSelectedDates}
            />

            <div className="form-actions">
                <button
                    onClick={() => navigate(`/events/${id}`)}
                    className="btn-secondary"
                >
                    Annuler
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={submitting || selectedDates.length === 0}
                    className="btn-primary"
                >
                    {submitting ? 'Enregistrement...' : `Enregistrer (${selectedDates.length} dates)`}
                </button>
            </div>
        </div>
    );
};

export default SubmitAvailability;