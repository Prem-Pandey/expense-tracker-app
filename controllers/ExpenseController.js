// const { Expense } = require('../models');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const ExpenseController = (Expense)=>{
  return{
  async addExpense(req, res) {
    try {
      const { amount, description, category } = req.body;
      console.log("expense data" + req.body);
      // if (!req.headers.authorization) {
      //   return res.status(401).send('Unauthorized: Missing Authorization Header');
      // }
      
      const decodedToken = jwt.verify(req.headers.authorization?.split(' ')[1], '123@key');
if (!decodedToken) {
  console.log("Unauthorized: Invalid Token");
  return res.status(401).send('Unauthorized: Invalid Token');
}
const userId = decodedToken.id;
console.log("user-id"+ userId)
        console.log('Decoded Token:', decodedToken);
      const newExpense = await Expense.create({
        amount,
        description,
        category,
        UserId: userId,
      });

      res.status(201).send('Expense added successfully');
    } catch (error) {
      console.error('Error addinggggaaaaaa expense:', error);
      if (error.name === 'JsonWebTokenError') {
        console.log("Unauthorized: Invalid Token")
        return res.status(401).send('Unauthorized: Invalid Token');
      }
      res.status(500).send('Internal Server Error');
    }
  },

  async getAllExpenses(req, res) {
    try {
      const decodedToken = jwt.verify(req.headers.authorization.split(' ')[1], '123@key');
        const userId = decodedToken.id;
      const allExpenses = await Expense.findAll({
        where: { UserId: userId },
      });

      res.status(200).json(allExpenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  async deleteExpense(req, res) {
    const expenseId = req.params.expenseId;

    try {
      const deletedExpense = await Expense.destroy({
        where: { id: expenseId },
      });

      if (deletedExpense) {
        res.status(200).send('Expense deleted successfully');
      } else {
        res.status(404).send('Expense not found');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      res.status(500).send('Internal Server Error');
    }
  },
};
}

module.exports = ExpenseController;
