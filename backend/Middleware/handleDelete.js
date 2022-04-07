const jwt = require("jsonwebtoken");
const Sauce = require('../models/sauces');
require("dotenv").config();

module.exports = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
  .then(sauce => {
        const token = req.headers.authorization.split(" ")[1]; 
        const decodedToken = jwt.verify(token, process.env.MONTOKEN); 
        console.log(decodedToken)
        const userId = decodedToken.userId;

    /* Vérifier si 'userId' de la requête correspond à celui du token */
    if (sauce.userId  != userId) {
      res.status(403).json({ message: 'Requête non autorisée' });
    } else {
      next();
    }
  })
  .catch(error => {
    res.status(401).json({ message: 'Requête non authentifiée' })
});
}
