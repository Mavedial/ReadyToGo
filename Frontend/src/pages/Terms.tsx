import React from 'react';

const Terms: React.FC = () => {
    return (
        <div className="page-container page-narrow">
            <div className="page-header">
                <h1>Conditions d'Utilisation</h1>
            </div>

            <div className="card">
                <h2>1. Introduction</h2>
                <p>
                    ReadyToGo est un service de planification d'événements
                    collaboratif développé par Warché Mathis.
                </p>

                <h2>2. Acceptation des conditions</h2>
                <p>
                    En accédant et en utilisant cette Application, vous acceptez d'être lié
                    par ces conditions d'utilisation.
                </p>

                <h2>3. Restrictions d'utilisation</h2>
                <ul>
                    <li>Vous ne pouvez pas accéder à l'Application de manière non autorisée</li>
                    <li>Vous ne pouvez pas spam, harceler ou abuser d'autres utilisateurs</li>
                    <li>Vous ne pouvez pas télécharger de contenu malveillant</li>
                </ul>

                <h2>4. Limitation de responsabilité</h2>
                <p>
                    ReadyToGo ne sera pas responsable des dommages directs, indirects,
                    accidentels ou punitifs découlant de votre utilisation de l'Application.
                </p>

                <h2>5. Modifications</h2>
                <p>
                    Nous nous réservons le droit de modifier ces conditions à tout moment.
                    Les modifications entreront en vigueur immédiatement après leur publication.
                </p>

                <h2>6. Contact</h2>
                <p>Pour toute question : MathisW1@outlook.fr</p>
            </div>
        </div>
    );
};

export default Terms;