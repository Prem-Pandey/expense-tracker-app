const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Sequelize } = require('sequelize');
const routes = require('./routes');
require('dotenv').config();

// const { FORCE } = require('sequelize/types/index-hints');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Sequelize setup
const sequelize = new Sequelize('expense_tracker', 'root', 'Pandey@131', {
  host: 'localhost',
  dialect: 'mysql',
});

// Import models
const User = require('./models/UserModel')(sequelize);
const Expense = require('./models/ExpenseModel')(sequelize);
const order = require('./models/order')(sequelize);
console.log("this is user sequelize: "+ User);

User.hasMany(order);
order.belongsTo(User);

// Import controllers and pass models
const UserController = require('./controllers/UserController')(User);
const ExpenseController = require('./controllers/ExpenseController')(Expense);
const Purchase = require('./controllers/Purchase')(order, User);

// Apply models to sequelize
order.sync({ force: false });
Expense.sync({ force: false });
User.sync({ force: false });





User.hasMany(Expense, { foreignKey: 'userId' });
Expense.belongsTo(User, { foreignKey: 'userId' });



// Use routes
// Use routes and pass controllers
app.use('/', routes(UserController, ExpenseController, Purchase));


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
