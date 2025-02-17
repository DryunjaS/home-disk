import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  status?: number;
}

const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({ message: "Непредвиденная ошибка!" });
};

export default errorMiddleware;
