import { Router } from "express";
import authRouter from "./authRouter";
import catalogsRouter from "./catalogRouter";

const router = Router();

router.use("/auth", authRouter);
router.use("/catalog", catalogsRouter);

export default router;
