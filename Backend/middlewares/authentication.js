const { User } = require("../models");
const { verifyToken } = require("../helpers/jwt");

module.exports = async function authentication(req, res, next) {
  try {
    // validate input
    if (!req.headers.authorization) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    // verify token
    const data = verifyToken(req.headers.authorization.slice("Bearer ".length));

    const user = await User.findOne({ where: { email: data.email } });
    if (!user) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    req.user = user;
    // next
    next();
  } catch (err) {
    console.log(err, "<< error in authentication middleware");
    res.status(401).json({ message: "Invalid token" });
  }
};
