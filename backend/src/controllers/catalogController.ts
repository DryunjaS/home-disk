import { Request, Response, NextFunction } from "express";
import CatalogService from "../services/CatalogService";
import path from "path";
import fs from "fs";
import iconv from "iconv-lite";

class CatalogController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const pathParam = (req.query.path as string) || "static";
      const catalogList = await CatalogService.getAll(pathParam);

      return res.status(200).json(catalogList);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Ошибка при получении каталогов!" });
    }
  }
  async createFolder(req: Request, res: Response, next: NextFunction) {
    try {
      const basePath = path.join(__dirname, "..", "..", "static");
      const folderName = req.body.path;

      const result = await CatalogService.createFolder(basePath, folderName);

      return res.json(result);
    } catch (error) {
      console.error("Ошибка при создании каталога:", error);
      return res
        .status(500)
        .json({ message: "Ошибка сервера при создании каталога." });
    }
  }

  async uploadFile(req: any, res: Response, next: NextFunction) {
    try {
      let fileName = iconv.decode(
        Buffer.from(req.file.originalname, "binary"),
        "utf-8"
      );

      fileName = fileName.replace(/[<>:"/\\|?*]+/g, "_");

      const uploadPath = path.join(
        process.cwd(),
        "static",
        req.query.path || "",
        fileName
      );

      fs.rename(req.file.path, uploadPath, (err) => {
        if (err) return res.status(500).json({ message: "Ошибка загрузки" });
        res.json({ message: "Файл загружен!" });
      });
    } catch (error) {
      console.error("Ошибка загрузки:", error);
      return res.status(500).json({ message: "Ошибка загрузки" });
    }
  }
  async renameItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { currentPath, newName } = req.body;
      if (!currentPath || !newName) {
        return res.status(400).json({ message: "Некорректные данные" });
      }

      const basePath = path.join(process.cwd(), "static");
      const oldFullPath = path.join(basePath, currentPath);
      const newFullPath = path.join(path.dirname(oldFullPath), newName);

      if (!fs.existsSync(oldFullPath)) {
        return res.status(404).json({ message: "Файл или каталог не найден" });
      }

      if (fs.existsSync(newFullPath)) {
        return res.status(400).json({ message: "Такое имя уже существует" });
      }

      fs.renameSync(oldFullPath, newFullPath);

      res.json({ message: "Переименование выполнено успешно" });
    } catch (error) {
      console.error("Ошибка при переименовании:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }
  async deleteItems(req: Request, res: Response) {
    try {
      const { items } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Некорректные данные" });
      }

      const basePath = path.join(process.cwd(), "static");

      items.forEach((itemPath) => {
        const fullPath = path.join(basePath, itemPath);

        if (!fs.existsSync(fullPath)) {
          console.warn(`Файл или каталог не найден: ${fullPath}`);
          return;
        }

        const stats = fs.statSync(fullPath);
        if (stats.isFile()) {
          fs.unlinkSync(fullPath);
        } else {
          fs.rmSync(fullPath, { recursive: true, force: true });
        }
      });

      res.json({ message: "Удаление выполнено успешно" });
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }
}

export default new CatalogController();
