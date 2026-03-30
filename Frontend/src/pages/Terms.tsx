import React from 'react';
import { Link } from 'react-router-dom';

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
                    par ces conditions d'utilisation et notre{' '}
                    <Link to="/privacy">Politique de Confidentialité</Link>.
                </p>

                <h2>3. Restrictions d'utilisation</h2>
                <ul>
                    <li>Vous ne pouvez pas accéder à l'Application de manière non autorisée</li>
                    <li>Vous ne pouvez pas spam, harceler ou abuser d'autres utilisateurs</li>
                    <li>Vous ne pouvez pas télécharger de contenu malveillant</li>
                    <li>
                        Vous ne pouvez pas violer les droits d'auteur ou de propriété intellectuelle
                    </li>
                </ul>

                <h2>4. Données et confidentialité</h2>
                <p>
                    Vos données personnelles sont traitées conformément à notre{' '}
                    <Link to="/privacy">Politique de Confidentialité</Link> et au{' '}
                    <strong>RGPD (Règlement Général sur la Protection des Données)</strong>.
                </p>
                <p>
                    Vous consentez au traitement de vos données personnelles lors de votre
                    inscription et acceptez explicitement nos conditions.
                </p>

                <h2>5. Durée de conservation</h2>
                <ul>
                    <li>
                        Vos données personnelles sont conservées tant que votre compte est actif
                    </li>
                    <li>
                        Après suppression de votre compte, vos données sont effacées dans les
                        <strong> 30 jours</strong>
                    </li>
                    <li>
                        Les logs de conformité (dates de suppression) sont conservés{' '}
                        <strong>12 mois</strong> pour des raisons légales
                    </li>
                </ul>

                <h2>6. Limitation de responsabilité</h2>
                <p>
                    ReadyToGo ne sera pas responsable des dommages directs, indirects,
                    accidentels ou punitifs découlant de votre utilisation de l'Application.
                </p>

                <h2>7. Modifications</h2>
                <p>
                    Nous nous réservons le droit de modifier ces conditions à tout moment.
                    Les modifications entreront en vigueur immédiatement après leur publication.
                </p>

                <h2>8. Contact et support</h2>
                <p>
                    Pour toute question ou réclamation concernant ces conditions d'utilisation :
                </p>
                <p>
                    <strong>Email :</strong>{' '}
                    <a href="mailto:MathisW1@outlook.fr">MathisW1@outlook.fr</a>
                </p>
                <p>
                    Inclure la mention <strong>"Support ReadyToGo"</strong> dans le sujet de
                    votre email.
                </p>

                <h2>9. Mention légales</h2>
                <p>
                    Pour plus d'informations juridiques et légales, consultez nos{' '}
                    <Link to="/legal">Mentions Légales</Link>.
                </p>

                <p>
                    <strong>Dernière mise à jour :</strong> {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
};

export default Terms;