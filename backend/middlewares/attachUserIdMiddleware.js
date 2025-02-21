import User from "../models/userModel.js";

const attachUserId = async (req, res, next) => {
  try {
    const { identifier } = req.body; 

    if (!identifier) {
      return res.status(400).json({ message: "User identifier is required" });
    }

    const user = await User.findOne({
      $or: [{ username: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.userId = user._id; 
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export default attachUserId;
