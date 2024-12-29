const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const authController = require('../controllers/authController')

//USER Router
//login
router.post('/login',authController.login);

//register
router.post('/register',authController.register);

//logout
router.post('/logout',auth,authController.logout);

//refresh-token
router.get('/refresh',authController.refresh);


module.exports = router