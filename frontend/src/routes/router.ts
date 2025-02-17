import PageAuth from "../page/auth/PageAuth";
import MainPage from "../page/MainPage";

export const authRoutes = [
  {
    path: "/main",
    Component: MainPage,
  },
];
export const publicRoutes = [
  {
    path: "/auth",
    Component: PageAuth,
  },
];
