const User = require("../models/user");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const emailValidator = require('email-validator');
const passwordValidator = require('password-validator');
require('dotenv').config();

const passwordSchema = new passwordValidator();

passwordSchema
  .is()
  .min(8)
  .is()
  .max(20)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .not()
  .spaces();


exports.signup = (req, res, next) => {
  if (!emailValidator.validate(req.body.email)) {
    return res
      .status(401)
      .json({ message: "Veuillez entrer une adresse email valide" });
  }

  if (!passwordSchema.validate(req.body.password)) {
    return res.status(401).json({
      message:
      "Le mot de passe doit avoir au minimum 8 à 20 caractères avec au minimum 1 chiffre, 1 minuscule et 1 majuscule et ne doit pas contenir d'espace.",
    });
  }
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé" }))
        .catch((error) =>
          res.status(400).json({ message: "Cet email est déjà utilisé !" })
        );
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {

    /*recherche le champs email dans la requete */
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }

            /* si utilisateur existe */
            bcrypt.compare(req.body.password, user.password)
                .then(pass => {

            /* si mot de passe incorrect */
              if (!pass) {
                return res.status(401).json({ error: 'Mot de passe incorrect !'})
              }
              const newToken = jwt.sign(
                { userId: user._id }, 
                `${process.env.RND_TOKEN}`, 
                  { expiresIn: '24h' })

              res.setHeader('Authorization', 'Bearer '+ newToken);
                    
              res.status(200).json({
              userId: user._id,
              token: newToken})
                    
                })
        .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
};