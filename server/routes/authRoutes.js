const express = require('express');
const {register, login, verify, changePassword } = require('../controllers/authcontroler.js');
const authMiddleware = require('../middlewares/authMidleware.js');

const router = express.Router();


router.post("/register", register);
router.post("/login",login);
router.get("/verify",authMiddleware, verify);
router.put("/change-password", authMiddleware, changePassword);


module.exports = router;