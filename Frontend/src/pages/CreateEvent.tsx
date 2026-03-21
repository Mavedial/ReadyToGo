import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventAPI, friendAPI } from '../services/api';
import type { User } from '../types';

const CreateEvent: React.FC = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [friends, setFriends] = useState<User[]>([]);
    const [error, setError] = useState('');

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDateRange, setStartDateRange] = useState('');
    const [endDateRange, setEndDateRange] = useState('');
    const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);

    useEffect(() => {
        loadFriends();
    }, []);

    const loadFriends = async () => {
        try {
            const { data } = await friendAPI.getFriends();

            const friendUsers: User[] = (data as any[])
                .map((f) => {
                    const reqId = f.requester?._id ?? f.requester?.id;
                    const user = reqId === currentUser?.id ? f.recipient : f.requester;
                    console.log('🔍 User extrait:', user, 'ID:', user?.id, 'user._id:', (user as any)?._id);
                    return user;
                })
                .filter((f) => f !== null && f !== undefined);
            setFriends(friendUsers);
        } catch {
            // Friends list is optional – silently fail
        }
    };

    const toggleFriend = (id: string) => {
        if (!id) {
            console.warn('⚠️ ID vide!');
            return;
        }
        setSelectedFriendIds((prev) => {
            const newState = prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id];
            return newState;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Le titre est requis');
            return;
        }
        if (!startDateRange || !endDateRange) {
            setError('Les dates de début et de fin sont requises');
            return;
        }
        if (new Date(startDateRange) >= new Date(endDateRange)) {
            setError('La date de début doit être antérieure à la date de fin');
            return;
        }
        setLoading(true);
        try {
            const { data } = await eventAPI.createEvent({
                title: title.trim(),
                description: description.trim(),
                startDateRange,
                endDateRange,
                userIds: selectedFriendIds,
            });
            navigate(`/events/${data.event._id}`);
        } catch (err: any) {
            setError(err.response?.data?.message || "Erreur lors de la création de l'événement");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container page-narrow">
            <div className="page-header">
                <h1>Créer un événement</h1>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} noValidate className="form-card">
                {/* Title */}
                <div className="form-group">
                    <label htmlFor="title">Titre *</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Nom de l'événement"
                        maxLength={100}
                    />
                </div>

                {/* Description */}
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description optionnelle"
                        rows={3}
                    />
                </div>

                {/* Date range */}
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

                {/* Invite friends */}
                {friends.length > 0 && (
                    <div className="form-group">
                        <label>Inviter des amis</label>
                        <div className="friends-checklist">
                            {friends.map((friend) => {
                                const friendId = (friend as any)._id || friend.id;
                                if (!friendId) return null;

                                const inputId = `friend-${friendId}`;
                                return (
                                    <label key={friendId} htmlFor={inputId} className="checkbox-label">
                                        <input
                                            id={inputId}
                                            type="checkbox"
                                            checked={selectedFriendIds.includes(friendId)}
                                            onChange={() => toggleFriend(friendId)}
                                        />
                                        {friend.username}
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="form-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/events')}
                    >
                        Annuler
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Création en cours...' : "Créer l'événement"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateEvent;