import React from 'react';
import { Link } from 'react-router-dom';


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
                    <li>Relations d'amitié</li>
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

                <h2>4. Durée de conservation des données</h2>
                <ul>
                    <li>
                        <strong>Données de profil :</strong> Conservées tant que le compte est actif
                    </li>
                    <li>
                        <strong>Après suppression de compte :</strong> Suppression immédiate et
                        définitive (sauf logs de conformité conservés 12 mois)
                    </li>
                    <li>
                        <strong>Données d'événement :</strong> Supprimées avec le compte du créateur
                    </li>
                </ul>

                <h2>5. Vos droits RGPD</h2>
                <p>
                    Conformément au Règlement Général sur la Protection des Données (RGPD),
                    vous avez les droits suivants :
                </p>
                <ul>
                    <li>
                        <strong>Droit d'accès :</strong> Télécharger une copie de vos données{' '}
                        <Link to="/profile">dans votre profil</Link>
                    </li>
                    <li>
                        <strong>Droit de rectification :</strong> Modifier vos informations
                        personnelles depuis <Link to="/profile">votre profil</Link>
                    </li>
                    <li>
                        <strong>Droit à l'oubli (suppression) :</strong> Supprimer définitivement
                        votre compte et toutes vos données depuis{' '}
                        <Link to="/profile">votre profil</Link>
                    </li>
                    <li>
                        <strong>Droit à la portabilité des données :</strong> Exporter vos données
                        en format JSON depuis <Link to="/profile">votre profil</Link>
                    </li>
                </ul>

                <h2>6. Exercer vos droits RGPD</h2>
                <ol>
                    <li>
                        <strong>Télécharger mes données :</strong> Rendez-vous sur votre{' '}
                        <Link to="/profile">profil</Link> et cliquez sur{' '}
                        <em>"Télécharger mes données"</em>
                    </li>
                    <li>
                        <strong>Supprimer mon compte :</strong> Rendez-vous sur votre{' '}
                        <Link to="/profile">profil</Link>, section{' '}
                        <em>"Supprimer le compte"</em> et confirmez
                    </li>
                    <li>
                        <strong>Contacter le DPO :</strong> Pour toute question concernant vos
                        données, écrivez à{' '}
                        <a href="mailto:MathisW1@outlook.fr">MathisW1@outlook.fr</a> avec la
                        mention <em>"RGPD"</em> dans le sujet
                    </li>
                </ol>

                <h2>7. Modifications de la politique</h2>
                <p>
                    Nous nous réservons le droit de modifier cette politique à tout moment.
                    Les modifications entreront en vigueur immédiatement après leur publication.
                    Vous serez notifié des changements importants par email.
                </p>

                <h2>8. Contact - Responsable des données</h2>
                <p>
                    Pour toute question concernant cette politique ou l'exercice de vos droits :
                </p>
                <p>
                    <strong>Email :</strong>{' '}
                    <a href="mailto:MathisW1@outlook.fr">MathisW1@outlook.fr</a>
                </p>
                <p>
                    <strong>Dernière mise à jour :</strong> {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
};

export default Privacy;