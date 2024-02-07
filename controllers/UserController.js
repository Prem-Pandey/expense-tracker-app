const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const { User } = require('../models');

const UserController =(User) => {
  return {
    async signup(req, res) {
    try {
      const { username, email, password } = req.body;
      console.log(req.body);
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);

      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      console.log('User created:', newUser);
      res.status(200).send('Signup successful');
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const existingUser = await User.findOne({
        where: {
          email,
        },
      });

      if (existingUser) {
        const passwordMatch = await bcrypt.compare(password, existingUser.password);

        if (passwordMatch) {
          const token = existingUser.generateAuthToken();
          console.log('token:  '+token)
          res.status(200).send({token});
        } else {
          res.status(401).send('Login failed');
        }
      } else {
        res.status(404).send('User not found');
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).send('Internal Server Error');
    }
  },
};
}
module.exports = UserController;
