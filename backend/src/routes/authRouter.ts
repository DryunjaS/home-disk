import { Router } from "express";
import authController from "../controllers/authController";
import authMiddleware from "../middleware/authMiddleware";

const router = Router();

//@ts-ignore
router.post("/login", authController.login);
//@ts-ignore
router.get("/auth", authMiddleware, authController.check);

export default router;
