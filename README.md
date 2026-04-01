# 📅 ReadyToGo

Une **application web de planification d'événements collaboratifs** permettant aux utilisateurs de créer des événements, gérer leurs amis et soumettre leurs disponibilités.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)

---

## 🎯 Fonctionnalités

✨ **Gestion d'utilisateurs**
- Inscription et connexion sécurisée
- Profil utilisateur personnalisé

👥 **Système d'amis**
- Ajouter/supprimer des amis
- Gérer les demandes d'amitié (accepter/refuser)
- Recherche d'utilisateurs

📆 **Gestion d'événements**
- Créer et modifier des événements
- Définir une plage de dates
- Inviter des amis
- Suivre le statut de l'événement (planification, vote, confirmé, annulé)

📊 **Disponibilités**
- Les participants soumettent leurs disponibilités
- Calcul automatique de la meilleure date basé sur les disponibilités communes

---

## 🛠️ Stack Technologique

### Frontend
- **React** 18+ avec **TypeScript**
- **React Router** pour la navigation
- **CSS** personnalisé avec variables CSS
- Architecture modulaire et réutilisable

### Backend
- **Node.js** + **Express**
- **MongoDB** avec **Mongoose** (ODM)
- Authentification JWT
- API RESTful

### Base de données
- **MongoDB** (NoSQL)
- Collections : Users, Events, Availabilities, Friendships

---

## 📦 Installation

### Prérequis
- Node.js 14+
- MongoDB local ou connexion à une instance cloud
- npm 

### Frontend

```bash
cd Frontend
npm install
npm start
