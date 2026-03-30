import React from 'react';

const Privacy: React.FC = () => {
    return (
        <div className="page-container page-narrow">
            <div className="page-header">
                <h1>Politique de Confidentialité</h1>
            </div>

            <div className="card">
                <h2>1. Données collectées</h2>
                <ul>
                    <li>Nom d'utilisateur</li>
                    <li>Email</li>
                    <li>Données de l'événement (titre, description, dates)</li>
                    <li>Disponibilités</li>
                </ul>

                <h2>2. Utilisation des données</h2>
                <p>
                    Vos données sont utilisées pour :
                </p>
                <ul>
                    <li>Fournir les services de l'Application</li>
                    <li>Améliorations et support</li>
                    <li>Conformité légale</li>
                </ul>

                <h2>3. Sécurité des données</h2>
                <p>
                    Nous utilisons le chiffrement SSL/TLS et d'autres mesures de sécurité
                    pour protéger vos données.
                </p>

                <h2>4. Vos droits RGPD</h2>
                <ul>
                    <li>Droit d'accès à vos données</li>
                    <li>Droit de rectification</li>
                    <li>Droit à l'oubli (suppression)</li>
                    <li>Droit à la portabilité des données</li>
                </ul>

            </div>
        </div>
    );
};

export default Privacy;