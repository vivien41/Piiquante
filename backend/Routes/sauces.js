const express = require("express");
const router = express.Router()
const saucesCtrl = require("../controller/sauces");
const auth = require('../middleware/authorization'); // middleware qui permet d'authentifier les pages de l'application
const multer = require("../middleware/multer");

router.post("/", multer, saucesCtrl.createSauces);
router.put("/:id", auth, saucesCtrl.modifySauces);
router.delete("/:id", auth, saucesCtrl.deleteSauces);
router.get("/", auth, saucesCtrl.getAllSauces);
router.get("/:id", auth, saucesCtrl.getOneSauces);

module.exports = router;