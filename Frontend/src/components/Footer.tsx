import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; 2026 ReadyToGo. Tous droits réservés.</p>
                <div className="footer-links">
                    <Link to="/terms">Conditions d'Utilisation</Link>
                    <Link to="/privacy">Politique de Confidentialité</Link>
                    <Link to="/legal">Mentions légales</Link>
                </div>
                <p>Contactez-nous : MathisW1@outlook.fr</p>
            </div>
        </footer>
    );
};

export default Footer;