import React, { useEffect, useState } from 'react';
import { friendAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Friendship, User } from '../types';

type Tab = 'friends' | 'pending' | 'search';

const Friends: React.FC = () => {
    const { user: currentUser } = useAuth();
    const [tab, setTab] = useState<Tab>('friends');
    const [friends, setFriends] = useState<Friendship[]>([]);
    const [pendingRequests, setPendingRequests] = useState<Friendship[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Search
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [searching, setSearching] = useState(false);
    const [sendingRequest, setSendingRequest] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setError('');
        try {
            const [friendsRes, pendingRes] = await Promise.all([
                friendAPI.getFriends(),
                friendAPI.getPendingRequests(),
            ]);
            setFriends(friendsRes.data);
            setPendingRequests(pendingRes.data);
        } catch {
            setError('Erreur lors du chargement');
        } finally {
            setLoading(false);
        }
    };

    const handleRespond = async (
        friendshipId: string,
        action: 'accepted' | 'rejected'
    ) => {
        try {
            await friendAPI.respondToRequest(friendshipId, action);
            setSuccess(action === 'accepted' ? 'Demande acceptée !' : 'Demande refusée');
            loadData();
        } catch {
            setError('Erreur lors de la réponse');
        }
    };

    const handleRemoveFriend = async (friendshipId: string) => {
        if (!window.confirm('Retirer cet ami ?')) return;
        try {
            await friendAPI.removeFriend(friendshipId);
            setSuccess('Ami retiré');
            loadData();
        } catch {
            setError("Erreur lors de la suppression");
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setSearching(true);
        setError('');
        try {
            const { data } = await userAPI.searchUsers(searchQuery.trim());
            setSearchResults(data);
        } catch {
            setError('Erreur lors de la recherche');
        } finally {
            setSearching(false);
        }
    };

    const handleSendRequest = async (recipientId: string) => {
        if (!recipientId) {
            setError('ID utilisateur invalide');
            return;
        }
        setSendingRequest(recipientId);
        setError('');
        try {
            await friendAPI.sendRequest(recipientId);
            setSuccess('Demande envoyée !');
            setSearchResults((prev) => prev.filter((u) => u.id !== recipientId));
        } catch (err: any) {
            setError(err.response?.data?.message || "Erreur lors de l'envoi");
        } finally {
            setSendingRequest(null);
        }
    };

    const getFriendUser = (f: Friendship): User | undefined => {
        const requesterData = f.requester as any;
        const reqId = requesterData?._id || requesterData?.id;

        const currentUserId = (currentUser as any)?._id || currentUser?.id;

        // Comparer les IDs
        return reqId === currentUserId ? f.recipient : f.requester;
    };

    if (loading) return <div className="loading">Chargement...</div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Amis</h1>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && (
                <div className="alert alert-success" onClick={() => setSuccess('')}>
                    {success}
                </div>
            )}

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`btn${tab === 'friends' ? ' active' : ''}`}
                    onClick={() => setTab('friends')}
                >
                    Mes amis ({friends.length})
                </button>
                <button
                    className={`btn${tab === 'pending' ? ' active' : ''}`}
                    onClick={() => setTab('pending')}
                >
                    Demandes ({pendingRequests.length})
                </button>
                <button
                    className={`btn${tab === 'search' ? ' active' : ''}`}
                    onClick={() => setTab('search')}
                >
                    Rechercher
                </button>
            </div>

            {/* Friends list */}
            {tab === 'friends' && (
                <div className="tab-content">
                    {friends.length === 0 ? (
                        <div className="empty-state">
                            <p>Vous n'avez pas encore d'amis.</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => setTab('search')}
                            >
                                Trouver des amis
                            </button>
                        </div>
                    ) : (
                        <ul className="list">
                            {friends.map((f) => {
                                const friend = getFriendUser(f);
                                return (
                                    <li key={f._id} className="list-item">
                                        <span className="list-item-name">
                                            {friend?.username ?? 'Utilisateur'}
                                        </span>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleRemoveFriend(f._id)}
                                        >
                                            Retirer
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}

            {/* Pending requests */}
            {tab === 'pending' && (
                <div className="tab-content">
                    {pendingRequests.length === 0 ? (
                        <div className="empty-state">
                            <p>Aucune demande d'ami en attente.</p>
                        </div>
                    ) : (
                        <>
                            {pendingRequests.length > 0 && (
                                <section className="section">
                                    <h2 className="section-title">
                                        Demandes reçues et envoyées
                                    </h2>
                                    <ul className="list">
                                        {pendingRequests.map((f) => (
                                            <li key={f._id} className="list-item">
                                                <div>
                                                    <p className="list-item-name">
                                                        {f.requester?.username} →{' '}
                                                        {f.recipient?.username}
                                                    </p>
                                                    <p className="text-muted text-sm">
                                                        {new Date(f.createdAt).toLocaleDateString('fr-FR')}
                                                    </p>
                                                </div>
                                                <div className="list-item-actions">
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        onClick={() =>
                                                            handleRespond(f._id, 'accepted')
                                                        }
                                                    >
                                                        Accepter
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() =>
                                                            handleRespond(f._id, 'rejected')
                                                        }
                                                    >
                                                        Refuser
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Search */}
            {tab === 'search' && (
                <div className="tab-content">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Rechercher un utilisateur par nom..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={handleSearch}
                            disabled={searching}
                        >
                            {searching ? 'Recherche...' : 'Rechercher'}
                        </button>
                    </div>

                    {searchResults.length > 0 && (
                        <ul className="list" style={{ marginTop: '1rem' }}>
                            {searchResults.map((u) => {
                                const userId = (u as any)._id || u.id;

                                return (
                                    <li key={userId} className="list-item">
                                        <span className="list-item-name">{u.username}</span>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => {
                                                handleSendRequest(userId);
                                            }}
                                        >
                                            {sendingRequest === userId
                                                ? 'Envoi...'
                                                : 'Ajouter'}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default Friends;