const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controller/sauces");
const auth = require("../middleware/authorization"); // middleware qui permet d'authentifier les pages de l'application
const multer = require("../middleware/multer");

router.post("/", auth, multer, sauceCtrl.createSauce);
router.put("/:id",  auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.get("/", sauceCtrl.getAllSauce);
router.get("/:id", sauceCtrl.getOneSauce);

//liker une sauce
router.post("/:id/like",  auth, multer, sauceCtrl.likeSauce);

module.exports = router;