// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { signup, login, me } = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", auth, me); // protected: needs a valid token

module.exports = router;