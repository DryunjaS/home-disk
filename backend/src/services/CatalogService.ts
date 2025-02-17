import fs from "fs";
import path from "path";

class CatalogService {
  async getAll(
    pathParam: string
  ): Promise<Array<{ name: string; type: string }> | { message: string }> {
    try {
      const directoryPath = path.join(__dirname, "../..", pathParam);
      if (!fs.existsSync(directoryPath)) {
        return { message: `Папка ${pathParam} не найдена` };
      }

      const entries = fs.readdirSync(directoryPath, { withFileTypes: true });

      const result = entries.map((dirent) => ({
        name: dirent.name,
        type: dirent.isDirectory() ? "каталог" : "файл",
      }));

      return result;
    } catch (error) {
      console.error(error);
      return { message: "Ошибка при получении файлов и каталогов!" };
    }
  }
  async createFolder(
    basePath: string,
    initialFolderName: string
  ): Promise<{ message: string; folderName: string }> {
    try {
      let folderName = initialFolderName;
      let folderPath = path.join(basePath, folderName);
      let counter = 2;

      console.log(folderPath);
      while (fs.existsSync(folderPath)) {
        folderName = `${initialFolderName} ${counter}`;
        folderPath = path.join(basePath, folderName);
        counter++;
      }

      fs.mkdirSync(folderPath, { recursive: true });

      return { message: "Каталог создан!", folderName };
    } catch (error) {
      console.error("Ошибка при создании каталога:", error);
      throw new Error("Ошибка сервера при создании каталога.");
    }
  }
}

export default new CatalogService();
