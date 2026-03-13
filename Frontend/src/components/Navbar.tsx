import { Link, NavLink, useNavigate } from 'react-router-dom';
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
                    <li>
                        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                            Tableau de bord
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/events" className={({ isActive }) => isActive ? 'active' : ''}>
                            Événements
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/friends" className={({ isActive }) => isActive ? 'active' : ''}>
                            Amis
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
                            Profil
                        </NavLink>
                    </li>
                </ul>

                <div className="navbar-user">
                    <span className="navbar-username">👤 {user?.username}</span>
                    <button onClick={handleLogout} className="btn-logout">
                        Déconnexion
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;