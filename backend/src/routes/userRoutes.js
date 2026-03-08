import express from "express";
import protect from "../middleware/authMiddleware.js";
import User from "../models/User.model.js";
import Document from "../models/Document.model.js";

const router = express.Router();

router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    const signedDocs = await Document.countDocuments({
      user: req.user.id
    });

    res.json({
      name: user.name,
      email: user.email,
      credits: user.credits || 100,
      signedDocuments: signedDocs
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile"
    });
  }
});

router.put("/profile", protect, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    await user.save();

    res.json({
      message: "Profile updated successfully",
      name: user.name
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile"
    });
  }
});

export default router;