const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userServices = require("../../services/users");

async function checkPassword(password, encryptedPassword) {
  return await bcrypt.compareSync(password, encryptedPassword)
}

function createToken(payload) {
  return jwt.sign(payload, process.env.JWT_SIGNATURE_KEY || "Token");
}

module.exports = {
  async register(req, res, next) {
    try {
      const {
        name,
        email,
        password
      } = req.body
      const encryptedPassword = await bcrypt.hash(password, 10)
      const user = await userServices.create({
        email: email.toLowerCase(),
        name,
        encryptedPassword
      });
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
      next();
    } catch (err) {
      res.status(401).json({
        status: "Failed",
        message: err.message
      });
    }
  },

  async login(req, res) {
    try {
      const email = req.body.email.toLowerCase();
      const password = req.body.password;

      const user = await userServices.getOne({
        where: {
          email
        },
      });

      if (!user) {
        res.status(404).json({
          status:"Failed",
          message:"Email not found!"
        });
        return
      }

      const isPasswordCorrect = await bcrypt.compareSync(password, user.encryptedPassword)

      if (!isPasswordCorrect) {
        res.status(401).json({
          status:"Failed",
          message: "Password is incorrect!"
        });
        return;
      }

      const token = createToken({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }, process.env.JWT_PRIVATE_KEY || 'apahayo', {
        expiresIn: '1h'
      });

      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        token,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (err) {
      res.status(401).json({
        status: "Failed",
        message: err.message
      });
    }
  },
};