const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; 
        const decodedToken = jwt.verify(token, process.env.MONTOKEN); 
        conseole.log(decodedToken)
        const userId = decodedToken.userId;
    /*Ajout de 'userId' à l'objet requete => L'ajout d'un attribut à l'objet req le rend accessible à tout les middleware */
    req.auth = { userId: userId };
    /* Vérifier si 'userId' de la requête correspond à celui du token */
    if (req.body.userId && req.body.userId !== userId) {
      throw "User ID non valable";
    } else {
      next();
    }
  } 
  catch (error) {
    res.status(401).json({ error: error | "Requête non authentifiée" });
  }
};
