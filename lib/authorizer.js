const jwt = require("jsonwebtoken");

function authorizer(req, res, next) {
  let token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1]; // Extract token from "Bearer <token>"
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    console.log("Decoded JWT:", decoded);
    req.user = decoded; // Store user details in req.user
    next(); // Move to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = { authorizer };
