const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.json({ message: "no token" });
  const token = authHeader.split(" ")[1];
  if (!token) return res.json({ message: "no token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_CODE);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = { authenticateUser };
