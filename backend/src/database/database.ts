import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { initUsers } from "./models/User";

dotenv.config();

const sequelize = new Sequelize({
  logging: false,
  database: process.env.DB_NAME as string,
  dialect: "postgres",
  username: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT) || 5432,
});

async function initializeDatabase() {
  try {
    initUsers(sequelize);

    await sequelize.authenticate();
    console.log("✅ Подключение к базе данных успешно.");

    await sequelize.sync();
    console.log("✅ Модели синхронизированы с базой данных.");
  } catch (error) {
    console.error("❌ Ошибка инициализации базы данных:", error);
  }
}

initializeDatabase();

export default sequelize;
