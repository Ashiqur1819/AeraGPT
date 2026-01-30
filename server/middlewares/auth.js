import jwt from "jsonwebtoken";
import User from "../models/user-model";

const protect = async (req, res, next) => {
  const token = req.headers.authorization;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = User.findById(userId);

    if (user) {
      return res.json({
        success: false,
        message: "Not authorized. User not found!",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized. Token faild!" });
  }
};
