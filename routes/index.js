const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');
const transactionController = require ('../controllers/transactionController');
const categoryController = require ('../controllers/categoryController');

//USER Router
//login
router.post('/login',authController.login);

//register
router.post('/register',authController.register);

//logout
router.post('/logout',auth,authController.logout);

//refresh-token
router.get('/refresh',authController.refresh);

// Transaction routes
router.post('/transactions', transactionController.addTransaction);
router.get('/transactions', transactionController.getTransactions);
router.get('/transactions/:id', transactionController.getTransactionById);
router.put('/transactions/:id', transactionController.updateTransaction);
router.delete('/transactions/:id', transactionController.deleteTransaction);

// Category routes
router.post('/categories', categoryController.addCategory);
router.get('/categories', categoryController.getCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.put('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);


module.exports = router