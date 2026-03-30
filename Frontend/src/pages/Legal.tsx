import React from 'react';

const Legal: React.FC = () => {
    return (
        <div className="page-container page-narrow">
            <div className="page-header">
                <h1>Mentions Légales</h1>
            </div>

            <div className="card">
                <h2>Éditeur du site</h2>
                <p>
                    ReadyToGo<br/>
                    Warché Mathis<br/>
                    MathisW1@outlook.fr
                </p>

                <h2>Hébergeur</h2>
                <p>
                    [Nom du serveur/hébergeur]<br/>
                    [Adresse]<br/>
                    [Contact]
                </p>

                <h2>Crédits</h2>
                <ul>
                    <li>React - UI</li>
                    <li>Node.js - Backend</li>
                    <li>MongoDB - Base de données</li>
                </ul>

                <h2>Propriété Intellectuelle</h2>
                <p>
                    Tous les contenus de l'Application (textes...) sont
                    protégés par les droits d'auteur.
                </p>
            </div>
        </div>
    );
};

export default Legal;