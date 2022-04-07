const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controller/sauces");
const handleDelete = require("../middleware/handleDelete")
const auth = require("../middleware/auth"); // middleware qui permet d'authentifier les pages de l'application
const multer = require("../middleware/multer");

router.post("/", auth, multer, sauceCtrl.createSauce);
router.put("/:id",  auth, handleDelete, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, handleDelete, sauceCtrl.deleteSauce);
router.get("/", sauceCtrl.getAllSauce);
router.get("/:id", sauceCtrl.getOneSauce);

//liker une sauce
router.post("/:id/like",  auth, multer, sauceCtrl.likeSauce);

module.exports = router;