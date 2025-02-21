import express from "express";
import { signup, signin } from "../controllers/userController.js";
import { transferCoins } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);

router.post("/transfer", transferCoins);

export default router;
