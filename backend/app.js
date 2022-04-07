const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require('express-rate-limit')

const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauces");



const app = express();


require("dotenv").config();

// mongoose connect
mongoose.connect(`mongodb+srv://vivienp:lylyvivi0505@cluster0.9jyvr.mongodb.net/P6?retryWrites=true&w=majority`,
    { useNewUrlParser: true,
     useUnifiedTopology: true
    })
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

// CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

/* Limiter envoie de plusieur requête en même temps */
const  limiter  =  rateLimit ( { 
	windowMs : 15  *  60  *  1000 , /* 15 minutes */
	max : 100 ,  /* Limite chaque IP à 100 requêtes par 15 minutes */
	standardHeaders : true ,  /* Limite de taux de retour info dans les en-têtes */
	legacyHeaders : false ,  /*- Désactive les en-têtes `X-RateLimit-*` */
});

    // Gestion des static (images)
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(express.json())
app.use(limiter);
 
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes);


module.exports = app; 