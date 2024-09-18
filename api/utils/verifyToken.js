import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token)
    return res
      .status(403)
      .json({ message: "Access denied. No token provided." });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(401).json({ message: "Invalid or expired token." });
    req.user = decoded;
    next();
  });
};

export default verifyToken;
