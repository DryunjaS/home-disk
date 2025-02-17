import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: string;
  name: string;
  role: string;
}
interface ReqAuth {
  cookies: any;
  user: any;
}

const authMiddleware = async (
  req: ReqAuth,
  res: Response,
  next: NextFunction
) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken) {
    if (!refreshToken) {
      res.cookie("isAuth", false, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
      });
      return res.redirect("/auth");
    }

    try {
      const decodedRefresh = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET_KEY as string
      ) as DecodedToken;

      const newAccessToken = jwt.sign(
        {
          id: decodedRefresh.id,
          name: decodedRefresh.name,
          role: decodedRefresh.role,
        },
        process.env.SECRET_KEY as string,
        { expiresIn: "15m" }
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: false,
        secure: false,
        maxAge: 15 * 60 * 1000,
      });

      req.user = decodedRefresh;
      return next();
    } catch (e) {
      res.cookie("isAuth", false, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
      });
      return res.redirect("/auth");
    }
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.SECRET_KEY as string
    ) as DecodedToken;

    req.user = decoded;
    next();
  } catch (e) {
    res.cookie("isAuth", false, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return res.redirect("/auth");
  }
};

export default authMiddleware;
