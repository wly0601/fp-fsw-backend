const bcrypt = require("bcryptjs");
const userServices = require("../../services/users");

function encryptPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, encryptedPassword) => {
      if (!!err) {
        reject(err);
        return;
      }

      resolve(encryptedPassword);
    });
  });
}

function checkPassword(encryptedPassword, password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, encryptedPassword, (err, isPasswordCorrect) => {
      if (!!err) {
        reject(err);
        return;
      }

      resolve(isPasswordCorrect);
    });
  });
}

module.exports = {
  async register(req, res) {
    const {name, email, password} = req.body
    const encryptedPassword = await encryptPassword(password);
    const user = await userServices.create({ email,name, encryptedPassword });
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  },

};
