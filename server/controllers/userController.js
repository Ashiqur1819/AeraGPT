import User from "../models/user-model.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

// API to register user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ success: false, message: "User already exists!" });
    }
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    return res.json({ success: true, token });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// API to login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = generateToken(user._id);
        return res.json({ success: true, token });
      }
      return res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Api to get user data
export const getUser = async (req, res) => {
  try {
    const user = await req.user;
    return res.json({ success: true, user });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
