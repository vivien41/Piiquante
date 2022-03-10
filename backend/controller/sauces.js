const Sauce = require('../models/sauces'); // import du modèle Sauce
const fs = require('fs');



exports.createSauce = (req, res, next) => {
  console.log ("sauce", req.body.sauce)
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() =>
      res.status(201).json({
        message: "Vous avez créé une nouvelle sauce !",
      })
    )
    .catch((error) => res.status(400).json({ error }));

    
};
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  if (req.file) {

      /* Recherche la sauce dans la base de données selon l'_id de la sauce */
      Sauce.findOne({ 
          _id: req.params.id 
      })
      .then(sauce => {

              /*si l'image est modifiée, supprime l'ancienne image dans le dossier /images */
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {

                  /*une fois l'ancienne image supprimée, mise à jour */
                  const sauceObject = {
                      ...JSON.parse(req.body.sauce),
                      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                  }

                  /* Sauvegarde la mise à jour */
                  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                      .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
                      .catch(error => res.status(400).json({ error }));
              })
          })
          .catch(error => res.status(500).json({ error }));
  } else {
      // si l'image n'est pas modifiée
      const sauceObject = { ...req.body };
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
          .catch(error => res.status(400).json({ error }));
  }
};

  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };
  
  exports.getAllSauce = (req, res, next) => {

    /* Recherche toute les sauces dans la base de données */
    Sauce.find()
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
  };

 /*Contrôle pour ajouter, modifier, mettre à jour et effacer y compris les likes et les dislikes **/

exports.likeSauce = (req, res, next) => {
  switch (req.body.like) {
    
    // 
    case 0:    // Défault = 0  
      Sauce.findOne({ _id: req.params.id }) /*Trouver la sauce par rapport a son _id. */
        .then((sauce) => {
          if (sauce.usersLiked.find(user => user === req.body.userId)) {   
            Sauce.updateOne({ _id: req.params.id }, {
              $inc: { likes: -1 },           
              $pull: { usersLiked: req.body.userId },     
              _id: req.params.id
            })
              .then(() => { res.status(201).json({ message: 'Ton avis a été pris en compte!' }); })
              .catch((error) => { res.status(400).json({ error: error }); });

          } if (sauce.usersDisliked.find(user => user === req.body.userId)) {      
            Sauce.updateOne({ _id: req.params.id }, {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId }, 
              _id: req.params.id
            })
              .then(() => { res.status(201).json({ message: 'Ton avis a été pris en compte!' }); })
              .catch((error) => { res.status(400).json({ error: error }); });
          }
        })
        .catch((error) => { res.status(404).json({ error: error }); });
      break;


    /*Mise à jour des likes (+1) */
    case 1:
      Sauce.updateOne({ _id: req.params.id }, {
        $inc: { likes: 1 },
        $push: { usersLiked: req.body.userId },
        _id: req.params.id
      })
        .then(() => { res.status(201).json({ message: 'Ton like a été pris en compte!' }); })
        .catch((error) => { res.status(400).json({ error: error }); });
      break;

    /*Mise à jour des dislikes (+1) */
    case -1:
      Sauce.updateOne({ _id: req.params.id }, {
        $inc: { dislikes: 1 },
        $push: { usersDisliked: req.body.userId },
        _id: req.params.id
      })
        .then(() => { res.status(201).json({ message: 'Ton dislike a été pris en compte!' }); })
        .catch((error) => { res.status(400).json({ error: error }); });
      break;

    default:
      console.error('mauvaise requête');
  }
};
