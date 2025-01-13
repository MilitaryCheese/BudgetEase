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
router.post('/transactions',auth, transactionController.addTransaction);
router.get('/transactions',auth, transactionController.getTransactions);
router.get('/transactions/:id',auth, transactionController.getTransactionById);
router.put('/transactions/:id',auth, transactionController.updateTransaction);
router.delete('/transactions/:id',auth, transactionController.deleteTransaction);

// Category routes
router.post('/addcategories',auth, categoryController.addCategory);
router.get('/getcategories', auth,categoryController.getCategories);
router.get('/getCategoriesID/:id',auth, categoryController.getCategoryById);
router.put('/updateCategories/:id', auth,categoryController.updateCategory);
router.delete('/delCategories/:id', auth,categoryController.deleteCategory);


module.exports = router