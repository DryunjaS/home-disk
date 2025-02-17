import { Router } from "express";
import catalogController from "../controllers/catalogController";
import upload from "../middleware/uploadMiddleware";

const router = Router();

//@ts-ignore
router.get("/", catalogController.getAll);
//@ts-ignore
router.post("/create-folder", catalogController.createFolder);

router.post(
  "/upload-file",
  upload.single("file"),
  //@ts-ignore
  catalogController.uploadFile
);
//@ts-ignore
router.post("/rename", catalogController.renameItem);
//@ts-ignore
router.post("/delete-items", catalogController.deleteItems);

export default router;
