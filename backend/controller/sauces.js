const sauces = require('../models/sauces'); // import du modèle Sauce
const fs = require('fs');



exports.createSauces = (req, res, next) => {
  
    const sauceObject = JSON.parse(req.body.sauces);
    delete sauceObject._id;    
    const sauces = new sauces({ /* un nouvel objet sauce est crée avec le model Sauce */
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,   /* l'url de l'image enregistrée dans le dossier images du serveur est aussi stockée dans la bdd */      
    });
    sauces.save() // la sauce est sauvegardée dans la bdd
    .then( () => res.status(201).json({ message: 'Sauce saved'}))
    .catch( error => res.status(400).json({ error }))
    console.log(sauces);
    
};
exports.getOneSauces = (req, res, next) => {
  sauces.findOne({
    _id: req.params.id
  }).then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauces = (req, res, next) => {
  if (req.file) {

      // Recherche la sauce dans la base de données selon l'_id de la sauce 
      sauces.findOne({ 
          _id: req.params.id 
      })
      .then(sauces => {

              // si l'image est modifiée, supprime l'ancienne image dans le dossier /images
              const filename = sauces.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {

                  // une fois l'ancienne image supprimée, mise à jour
                  const sauceObject = {
                      ...JSON.parse(req.body.sauce),
                      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                  }

                  // sauvegarde la mise à jour
                  sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                      .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
                      .catch(error => res.status(400).json({ error }));
              })
          })
          .catch(error => res.status(500).json({ error }));
  } else {
      // si l'image n'est pas modifiée
      const sauceObject = { ...req.body };
      sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
          .catch(error => res.status(400).json({ error }));
  }
};

  exports.deleteSauces = (req, res, next) => {
    sauces.findOne({ _id: req.params.id })
      .then(sauces => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          sauces.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };
  
  exports.getAllSauces = (req, res, next) => {

    // Recherche toute les sauces dans la base de données
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
  }