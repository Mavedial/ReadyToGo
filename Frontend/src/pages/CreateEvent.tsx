import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventAPI, friendAPI } from '../services/api';
import { User } from '../types';

const CreateEvent: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [friends, setFriends] = useState<User[]>([]);
    const [error, setError] = useState('');

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDateRange, setStartDateRange] = useState('');
    const [endDateRange, setEndDateRange] = useState('');
    const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

    useEffect(() => {
        loadFriends();
    }, []);

    const loadFriends = async () => {
        try {
            const { data } = await friendAPI.getFriends();
            setFriends(data);
        } catch (error) {
            console.error('Erreur chargement amis:', error);
        }
    };

    const toggleFriend = (friendId: string) => {
        setSelectedFriends(prev =>
            prev.includes(friendId)
                ? prev.filter(id => id !== friendId)
                : [...prev, friendId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validations
        if (!title.trim()) {
            setError('Le titre est requis');
            return;
        }

        if (!startDateRange || !endDateRange) {
            setError('Les dates sont requises');
            return;
        }

        if (new Date(startDateRange) >= new Date(endDateRange)) {
            setError('La date de début doit être avant la date de fin');
            return;
        }

        setLoading(true);

        try {
            const { data } = await eventAPI.createEvent({
                title,
                description,
                startDateRange,
                endDateRange,
                invitedUserIds: selectedFriends
            });

            navigate(`/events/${data.event._id}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de la création');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>➕ Créer un événement</h1>
            </div>

            <div className="form-container">
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="event-form">
                    {/* Titre */}
                    <div className="form-group">
                        <label>Titre de l'événement *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Soirée Pizza 🍕"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Décrivez votre événement..."
                            rows={4}
                        />
                    </div>

                    {/* Plage de dates */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Date de début *</label>
                            <input
                                type="date"
                                value={startDateRange}
                                onChange={(e) => setStartDateRange(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Date de fin *</label>
                            <input
                                type="date"
                                value={endDateRange}
                                onChange={(e) => setEndDateRange(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Inviter des amis */}
                    <div className="form-group">
                        <label>Inviter des amis ({selectedFriends.length} sélectionné(s))</label>
                        {friends.length === 0 ? (
                            <p className="text-muted">
                                Vous n'avez pas encore d'amis.
                                <a href="/friends"> Ajouter des amis</a>
                            </p>
                        ) : (
                            <div className="friends-selector">
                                {friends.map((friend) => (
                                    <div
                                        key={friend.id}
                                        className={`friend-chip ${selectedFriends.includes(friend.id) ? 'selected' : ''}`}
                                        onClick={() => toggleFriend(friend.id)}
                                    >
                                        <span>👤 {friend.username}</span>
                                        {selectedFriends.includes(friend.id) && <span className="check">✓</span>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Boutons */}
                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate('/events')}
                            className="btn-secondary"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Création...' : 'Créer l\'événement'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;