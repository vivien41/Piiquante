const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const path = require('path');

const userRoutes = require('./routes/user');




const app = express();

require('dotenv').config();

// mongoose connect
mongoose.connect(`mongodb+srv://vivienp:lylyvivi0909@cluster0.9jyvr.mongodb.net/P6?retryWrites=true&w=majority`,
    { useNewUrlParser: true,
     useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use(bodyParser.json()); 

app.use('/api/auth', userRoutes);

module.exports = app; 