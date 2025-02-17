import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: (req: any, file, cb) => {
    const uploadPath = path.join(process.cwd(), "static", req.query.path || "");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    let fileName = file.originalname.replace(/[<>:"/\\|?*]+/g, "_");
    cb(null, fileName);
  },
});

const upload = multer({ storage });

export default upload;
