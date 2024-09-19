import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token)
    return res
      .status(403)
      .json({ message: "Access denied. No token provided." });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(401).json({ message: "Invalid or expired token." });
    req.user = user;
    next();
  });
};

export default verifyToken;
