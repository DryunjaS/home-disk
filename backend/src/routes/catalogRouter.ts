import { Router } from "express";
import catalogController from "../controllers/catalogController";
import upload from "../middleware/uploadMiddleware";
import authMiddleware from "../middleware/authMiddleware";
import checkRoleMiddleware from "../middleware/checkRoleMiddleware";

const router = Router();

//@ts-ignore
router.get("/", authMiddleware, catalogController.getAll);
//@ts-ignore
router.post("/create-folder", authMiddleware, catalogController.createFolder);

router.post(
  "/upload-file",
  upload.single("file"),
  //@ts-ignore
  authMiddleware,
  //@ts-ignore
  catalogController.uploadFile
);
//@ts-ignore
router.post("/rename", authMiddleware, catalogController.renameItem);
//@ts-ignore
router.post(
  "/delete-items",
  //@ts-ignore
  checkRoleMiddleware("ADMIN"),
  //@ts-ignore
  authMiddleware,
  catalogController.deleteItems
);

export default router;
