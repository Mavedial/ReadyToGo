import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/dashboard" className="navbar-logo">
                     ReadyToGo
                </Link>

                <ul className="navbar-menu">
                    <li><Link to="/dashboard">Tableau de bord</Link></li>
                    <li><Link to="/events">Événements</Link></li>
                    <li><Link to="/friends">Amis</Link></li>
                    <li><Link to="/profile">Profil</Link></li>
                </ul>

                <div className="navbar-user">
                    <span>👤 {user?.username}</span>
                    <button onClick={handleLogout} className="btn-logout">
                        Déconnexion
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;