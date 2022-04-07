const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; 
        const decodedToken = jwt.verify(token, process.env.MONTOKEN); 
        console.log(decodedToken)
        const userId = decodedToken.userId;
   
    /* Vérifier si 'userId' de la requête correspond à celui du token */
    if (req.body.userId && req.body.userId !== userId) {
      res.status(403).json({ message: 'Requête non autorisée' });
    } else {
      next();
    }
  } 
  catch (error) {
    res.status(403).json({ error: error | "Requête non authentifiée" });
  }
};