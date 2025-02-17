import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: string;
  name: string;
  role: string;
}

const roleMiddleware = (role: string) => {
  return (req: any, res: Response, next: NextFunction) => {
    try {
      const { accessToken } = req.cookies;
      if (!accessToken) {
        return res.status(401).json({ message: "Не авторизован" });
      }

      const decoded = jwt.verify(
        accessToken,
        process.env.SECRET_KEY as string
      ) as DecodedToken;

      if (decoded.role !== role) {
        return res.status(403).json({ message: "Нет доступа" });
      }

      req.user = decoded;
      next();
    } catch (e) {
      res.status(401).json({ message: "Не авторизован" });
    }
  };
};

export default roleMiddleware;
