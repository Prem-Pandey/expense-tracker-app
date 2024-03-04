const express = require('express');
const path = require('path');
const authMiddleware = require('../authMiddleware');
const router = express.Router();

module.exports = (UserController, ExpenseController, Purchase) => {
  // User routes
  router.get('/signup', (req, res) => {
    // Render signup view
    console.log('signup route')
  res.sendFile(path.join(__dirname, '../signUp.html'));
  });

  router.post('/signup', UserController.signup);
  router.get('/login', (req, res) => {
    // Render login view
    console.log('login route')
    res.sendFile(path.join(__dirname, '../login.html'));
  });

  router.post('/login', UserController.login);

  // Expense routes
  router.post('/addExpense', ExpenseController.addExpense);
  router.get('/getAllExpenses', ExpenseController.getAllExpenses);
  router.delete('/deleteExpense/:expenseId', ExpenseController.deleteExpense);
  // router.get('/premiummembership',Purchase.purchasepremium);
  // router.post('/premiummember', Purchase.purchasepremium)
  router.post('/premiummembership', Purchase.purchasepremium);
  router.post('/updatetransactionstatus', Purchase.updateTransactionStatus)
  return router;
};



