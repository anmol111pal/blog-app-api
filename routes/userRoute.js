const express = require("express");
const router = express.Router();
const path = require("path");

const { getUserDetails, register, login, logout } = require("../controllers/userController.js");


router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", getUserDetails);

module.exports = router;
