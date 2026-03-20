import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) return null;

    return (
        <>
            {/* Sprite SVG: toutes les icônes sont définies ici */}
            <svg style={{ display: 'none' }}>
                <defs>
                    {/* Dashboard (tableau de bord) */}
                    <g id="dashboard">
                        <path
                            fill="#90A4AE"
                            d="M4 4h12v12H4V4zm0 16h12v8H4v-8zm16-16h8v8h-8V4zm0 12h8v12h-8V16z"
                        />
                    </g>

                    {/* Calendar (événements) */}
                    <g id="calendar">
                        <path
                            fill="#90A4AE"
                            d="M22 4h-1V2h-2v2H9V2H7v2H6c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 20H6V10h16v14z"
                        />
                        <path
                            fill="#90A4AE"
                            d="M8 12h4v4H8v-4zm6 0h4v4h-4v-4zM8 18h4v4H8v-4zm6 0h4v4h-4v-4z"
                        />
                    </g>

                    {/* Friends (amis - 2 personnes) */}
                    <g id="friends">
                        <path
                            fill="#90A4AE"
                            d="M10 14c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm12 0c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3z"
                        />
                        <path
                            fill="#90A4AE"
                            d="M10 16c-3.3 0-6 1.7-6 4v2h12v-2c0-2.3-2.7-4-6-4zm12 0c-.9 0-1.8.2-2.6.5 1.6.9 2.6 2.1 2.6 3.5v2h6v-2c0-2.3-2.7-4-6-4z"
                        />
                    </g>

                    {/* Profil */}
                    <g id="profile">
                        <path
                            fill="#90A4AE"
                            d="M16 16c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5z"
                        />
                        <path
                            fill="#90A4AE"
                            d="M16 18c-4.4 0-8 2.2-8 5v3h16v-3c0-2.8-3.6-5-8-5z"
                        />
                    </g>

                    {/* Logout */}
                    <g id="logout">
                        <path
                            fill="#90A4AE"
                            d="M13 4h9c1.1 0 2 .9 2 2v5h-2V6h-9v20h9v-5h2v5c0 1.1-.9 2-2 2h-9c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                        />
                        <path
                            fill="#90A4AE"
                            d="M20 10l-1.4 1.4L21.2 14H6v2h15.2l-2.6 2.6L20 20l6-6-6-4z"
                        />
                    </g>
                </defs>
            </svg>

            <nav className="nav__cont" aria-label="Navigation principale">
                <ul className="nav">
                    <li className="nav__items">
                        <NavLink to="/dashboard">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true">
                                <use href="#dashboard" />
                            </svg>
                            <span className="nav__label">Tableau de bord</span>
                        </NavLink>
                    </li>

                    <li className="nav__items">
                        <NavLink to="/events">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true">
                                <use href="#calendar" />
                            </svg>
                            <span className="nav__label">Événements</span>
                        </NavLink>
                    </li>

                    <li className="nav__items">
                        <NavLink to="/friends">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true">
                                <use href="#friends" />
                            </svg>
                            <span className="nav__label">Amis</span>
                        </NavLink>
                    </li>

                    <li className="nav__items">
                        <NavLink to="/profile">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true">
                                <use href="#profile" />
                            </svg>
                            <span className="nav__label">Profil</span>
                        </NavLink>
                    </li>

                    <li className="nav__items">
                        <button type="button" className="nav__button" onClick={handleLogout}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true">
                                <use href="#logout" />
                            </svg>
                            <span className="nav__label">Déconnexion</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default Navbar;