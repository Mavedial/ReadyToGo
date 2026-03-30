import {Request, Response} from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import {logger} from "../utils/logger";
const MIN_LENGTH = 8;

//nouvel utilisateur
export const register = async (req: Request, res: Response) => {
    try{
        const {username, email, password, consentGiven} = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Champs requis manquants' });
        }

        if (!consentGiven) {
            return res.status(400).json({
                message: 'Vous devez accepter les conditions pour continuer'
            });
        }

        if(username.length > 20){
            return res.status(400).json({message: "Username doit contenir au maximum 20 caracteres !"})
        }
        if(!username || !password){
            return res.status(400).json({error: "Nécessite un Username et un mot de passe."});
        }
        if(!password ||password.length < MIN_LENGTH ){
            return res.status(400).json({message : "Le mot de passe doit contenir au minimum 8 caracteres !"})
        }

        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'Utilisateur ou email déjà utilisé'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username,
            email,
            password : hashedPassword,
            consentGiven: true,
            consentDate: new Date(),
            consentVersion: '1.0',
            consentAcceptedAt: new Date()
        });

        logger.info(`Nouvel utilisateur crée: ${username}`);
        return res.status(201).json({message: "Utilisateur crée", User})
    }
    catch(err){
        logger.error("Erreur lors de l'inscription :",err);
        return res.status(500).json({message:"Erreur serveur."});
    }
}

// login

export const login = async (req: Request, res: Response) => {
    try{
        const {username, password} = req.body;

        if(!username || !password){
            return res.status(400).json({message : "Nécessite un username et un mot de passe."});
        }

        // Trouver l'utilisateur
        const user = await User.findOne({username});
        if(!user){
            logger.warn(`Tentative de connexion avec username inexistant : ${username}`);
            return res.status(400).json({message : "Utilisateur introuvable !"});
        }

        //verif mdp
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            logger.warn(`Tentative de connexion avec mot de passe incorrect pour : ${username}`);
            return res.status(400).json({message:" Mot de passe incorrect !"});
        }

        // Créer un token JWT
        const token = jwt.sign(
        {id:user.id,},
        process.env.JWT_SECRET!,
            {expiresIn: "7d"}
        );

        //login reussie
        logger.info(`Connexion réussie pour ${username}`);
        return res.json({
            message : "Connexion réussie !",
            token,
            user : {id: user._id, username: user.username},
        });
    }
    catch(err){
        logger.error("Erreur lors de l'inscription :",err);
        return res.status(500).json({message:"Erreur serveur."});
    }
}

export const logout = async (req: Request, res: Response) => {

}
