import User from "../models/userModel.js";

const attachUser = async (req, res, next) => {
  try {
    const { username } = req.session || {}; // Assuming session stores username

    if (!username) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.username = user.username; // Attach username
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default attachUser;
