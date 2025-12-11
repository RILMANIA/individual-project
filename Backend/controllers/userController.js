const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");
const { OAuth2Client } = require("google-auth-library");

module.exports = class UserController {
  static async googleLogin(req, res, next) {
    try {
      // catch token from req body
      const { googleToken } = req.body;
      if (!googleToken) {
        throw { name: "BadRequest", message: "Google token is required" };
      }

      // verify token and get payload
      const client = new OAuth2Client();

      // verify the token apakah sesuai dengan client id
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      // isi dari token
      const payload = ticket.getPayload();
      console.log(payload);

      // check user in db
      let user = await User.findOne({ where: { email: payload.email } });

      // if not found, create new user
      if (!user) {
        user = await User.create({
          email: payload.email,
          password: Math.random().toString(36) + Date.now(), // generate random password
        });
      }

      const access_token = signToken({ id: user.id });
      res.status(200).json({ access_token });
    } catch (error) {
      next(error);
    }
  }

  // POST /register
  static async register(req, res) {
    try {
      const user = await User.create(req.body);
      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
      });
    } catch (err) {
      console.log(err, "<< error in UserController.register");
      // SequelizeValidationError
      // SequelizeUniqueConstraintError
      if (
        err.name === "SequelizeValidationError" ||
        err.name === "SequelizeUniqueConstraintError"
      ) {
        res.status(400).json({
          message: err.errors[0].message,
        });
      } else {
        res.status(500).json({
          message: "Internal server error",
        });
      }
    }
  }

  // POST /login
  static async login(req, res, next) {
    try {
      // validate input
      const { email, password } = req.body;
      if (!email) {
        res.status(400).json({ message: "Email is required" });
        return;
      }
      if (!password) {
        res.status(400).json({ message: "Password is required" });
        return;
      }

      // find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        res.status(401).json({
          message: "Invalid email/password",
        });
        return;
      }
      // check password
      const isValidPassword = comparePassword(password, user.password);

      if (!isValidPassword) {
        res.status(401).json({
          message: "Invalid email/password",
        });
        return;
      }

      // create token
      res.json({ access_token: signToken({ email: user.email }) });
    } catch (err) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
};
