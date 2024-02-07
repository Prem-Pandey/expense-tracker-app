const express = require('express');
const path = require('path');
const router = express.Router();

module.exports = (UserController, ExpenseController) => {
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

  return router;
};



