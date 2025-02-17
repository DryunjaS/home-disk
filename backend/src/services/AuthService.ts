import { Users } from "../database/models/User";
import bcrypt from "bcrypt";

class AuthService {
  async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const user = await Users.findByPk(userId);
    if (!user) {
      throw new Error("Пользователь не найден");
    }
    user.refresh_token = refreshToken;
    await user.save();
  }

  async registration(
    name: string,
    password: string
  ): Promise<{ id: string; role: string }> {
    if (!name.trim() || !password.trim()) {
      throw new Error("Некорректное имя или пароль");
    }

    const existingUser = await Users.findOne({ where: { login: name } });
    if (existingUser) {
      throw new Error("Пользователь с таким именем уже существует");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await Users.create({
      login: name,
      password: hashPassword,
    });

    return { id: user.id, role: user.role };
  }

  async login(
    name: string,
    password: string
  ): Promise<{ id: string; role: string }> {
    const user = await Users.findOne({ where: { login: name } });
    if (!user) {
      throw new Error("Пользователь не найден");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error("Неверный пароль");
    }

    return { id: user.id, role: user.role };
  }

  async createUsers(): Promise<void> {
    try {
      const admin = await Users.findOne({ where: { login: "admin" } });
      const user = await Users.findOne({ where: { login: "user" } });

      if (!admin) {
        const hashPassword = await bcrypt.hash("admin", 10);
        await Users.create({
          login: "admin",
          password: hashPassword,
          role: "ADMIN",
        });
        console.log("Admin создан.");
      } else {
        console.log("Admin уже существует.");
      }

      if (!user) {
        const hashPassword = await bcrypt.hash("user", 10);
        await Users.create({
          login: "user",
          password: hashPassword,
          role: "USER",
        });
        console.log("User создан.");
      } else {
        console.log("User уже существует.");
      }
    } catch (error) {
      console.error("Ошибка при создании пользователей:", error);
    }
  }
}

export default new AuthService();
