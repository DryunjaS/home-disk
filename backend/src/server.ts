import server from "./app";
import sequelize from "./database/database";
import AuthService from "./services/AuthService";

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Подключен к базе данных");

    await sequelize.sync();

    await AuthService.createUsers();

    const PORT: number = parseInt(process.env.APP_PORT || "5000", 10);
    const IP: string = process.env.APP_IP || "localhost";

    server.listen(PORT, IP, () => {
      console.log(`Сервер запущен на ${IP}:${PORT}`);
    });
  } catch (error) {
    console.error("Ошибка при подключении к БД:", error);
  }
};

startServer();
