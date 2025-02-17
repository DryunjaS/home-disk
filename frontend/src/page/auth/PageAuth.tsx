import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../http/userAPI";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, CircularProgress, Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import { toggleTheme } from "../../store/SettingSlice";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightlightIcon from "@mui/icons-material/Nightlight";
import { blue } from "@mui/material/colors";
import { RootState } from "../../store";

const PageAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.settings.theme);

  const [loading, setLoading] = React.useState(false);
  const [isError, setIsError] = useState(false);

  const [user, setUser] = useState({
    login: "",
    password: "",
  });

  const changeInput = (event: any) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
    setIsError(false);
  };

  const userAuth = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(user.login, user.password);
      navigate("/main");
    } catch (error) {
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const isDarkTheme = theme === "dark";
  const boxStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: isDarkTheme ? "#101316" : "#fff",
    "& .MuiTextField-root": { m: 1, width: "350px" },
    color: isDarkTheme ? "#fff" : "#000",
  };
  const formContainerStyles = {
    padding: "20px",
    borderRadius: "8px",
    border: `1px solid ${isDarkTheme ? "#444" : "#ddd"}`,
    boxShadow: isDarkTheme
      ? "0px 4px 12px rgba(0, 0, 0, 0.3)"
      : "0px 4px 12px rgba(0, 0, 0, 0.1)",
    backgroundColor: isDarkTheme ? "#1f2428" : "#fff",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <Box
      component="form"
      sx={boxStyles}
      noValidate
      autoComplete="off"
      onSubmit={userAuth}
    >
      <Box sx={formContainerStyles}>
        <Typography variant="h3" gutterBottom>
          Авторизация
        </Typography>
        <div>
          <TextField
            id="filled-login"
            label="Логин"
            name="login"
            placeholder="Введите логин..."
            variant="outlined"
            value={user.login}
            onChange={changeInput}
            sx={{
              width: "350px",
              backgroundColor: isDarkTheme ? "#333" : "#f5f5f5",
              borderRadius: "4px",
              height: "45px",
            }}
            InputProps={{
              style: {
                color: isDarkTheme ? "#fff" : "#000",
                height: "45px",
              },
            }}
            InputLabelProps={{
              style: {
                color: isDarkTheme ? "#fff" : "#000",
                height: "45px",
                lineHeight: "15px",
              },
            }}
          />
        </div>
        <div>
          <TextField
            id="filled-password"
            label="Пароль"
            name="password"
            placeholder="Введите пароль..."
            type="password"
            variant="outlined"
            value={user.password}
            onChange={changeInput}
            sx={{
              width: "350px",
              backgroundColor: isDarkTheme ? "#333" : "#f5f5f5",
              borderRadius: "4px",
              height: "45px",
            }}
            InputProps={{
              style: {
                color: isDarkTheme ? "#fff" : "#000",
                height: "45px",
              },
            }}
            InputLabelProps={{
              style: {
                color: isDarkTheme ? "#fff" : "#000",
                height: "45px",
                lineHeight: "15px",
              },
            }}
          />
        </div>
        {isError && (
          <div className="flex items-center justify-center">
            <ErrorIcon sx={{ color: "gray", mr: "10px" }} /> Ошибка авторизации
          </div>
        )}
        <div className="relative">
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ mt: 1, width: "345px", height: "40px" }}
          >
            Войти
          </Button>
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                color: blue[500],
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: "-8px",
                marginLeft: "-12px",
              }}
            />
          )}
        </div>
      </Box>
      <Button
        variant="text"
        onClick={() => dispatch(toggleTheme())}
        sx={{
          position: "absolute",
          top: "15px",
          right: "15px",
          minWidth: "auto",
          padding: "8px",
        }}
      >
        {theme === "light" ? <WbSunnyIcon /> : <NightlightIcon />}
      </Button>
    </Box>
  );
};

export default PageAuth;
