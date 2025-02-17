import { $authApi } from "../http/index";

export default class CatalogService {
  static async getAll(path = "/") {
    return $authApi.get(`/api/catalog?path=${encodeURIComponent(path)}`);
  }
  static async createFolder(path: string) {
    return $authApi.post(`/api/catalog/create-folder`, { path });
  }
  static async uploadFile(path: string, formData: FormData) {
    return $authApi.post(`/api/catalog/upload-file?path=${path}`, formData);
  }
  static async renameItem(currentPath: string, newName: string) {
    return $authApi.post(`/api/catalog/rename`, { currentPath, newName });
  }
  static async deleteItems(items: string[]) {
    return $authApi.post(`/api/catalog/delete-items`, { items });
  }
}
