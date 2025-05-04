const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { guardarPontuacao } = require("../controllers/gameController");

router.post("/score", authMiddleware, guardarPontuacao);

module.exports = router;
