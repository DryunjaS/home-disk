import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AuthService from "../services/AuthService";

interface DecodedToken {
  id: string;
  name: string;
  role: string;
}
interface ReqAuth {
  cookies: any;
  user: any;
}
const generateAccessToken = (id: string, name: string, role: string) => {
  return jwt.sign({ id, name, role }, process.env.SECRET_KEY as string, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (id: string, name: string, role: string) => {
  return jwt.sign(
    { id, name, role },
    process.env.REFRESH_SECRET_KEY as string,
    {
      expiresIn: "7d",
    }
  );
};

class AuthController {
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const { login, password } = req.body;
      if (!login || !password) {
        return res.status(400).json({ message: "Логин и пароль обязательны" });
      }

      const { id, role } = await AuthService.registration(login, password);
      const accessToken = generateAccessToken(id, login, role);
      const refreshToken = generateRefreshToken(id, login, role);

      await AuthService.saveRefreshToken(id, refreshToken);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({ message: "Регистрация успешна", role });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка при регистрации!" });
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { login, password } = req.body;
      console.log(login, password);

      if (!login || !password) {
        return res.status(400).json({ message: "Логин и пароль обязательны" });
      }

      const { id, role } = await AuthService.login(login, password);
      const accessToken = generateAccessToken(id, login, role);
      const refreshToken = generateRefreshToken(id, login, role);

      await AuthService.saveRefreshToken(id, refreshToken);

      res.cookie("isAuth", true, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({ message: "Добро пожаловать!", role });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка при входе!" });
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET_KEY as string
      ) as DecodedToken;

      const accessToken = generateAccessToken(
        decoded.id,
        decoded.name,
        decoded.role
      );
      const newRefreshToken = generateRefreshToken(
        decoded.id,
        decoded.name,
        decoded.role
      );

      await AuthService.saveRefreshToken(decoded.id, newRefreshToken);

      res.cookie("isAuth", true, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({ message: "Токены обновлены" });
    } catch (error) {
      console.error(error);
      return res.status(403).json({ message: "Неверный refresh-токен" });
    }
  }

  async check(req: ReqAuth, res: Response, next: NextFunction) {
    if (!req.user) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    const token = generateAccessToken(
      req.user.id,
      req.user.name,
      req.user.role
    );
    return res.json({ token });
  }
}

export default new AuthController();
