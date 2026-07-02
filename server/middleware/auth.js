// middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer "))
    return res.status(401).json({ message: "Not authenticated" });

  const token = header.split(" ")[1]; // "Bearer xxx" → "xxx"
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next(); // token valid → let the request through
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};