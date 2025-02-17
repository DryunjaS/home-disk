import { Model, DataTypes, Sequelize } from "sequelize";

class Users extends Model {
  public id!: string;
  public login!: string;
  public password!: string;
  public role!: string;
  public refresh_token?: string;
}

function initUsers(sequelize: Sequelize) {
  Users.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      login: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user",
      },
      refresh_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Users",
      tableName: "users",
      timestamps: true,
    }
  );
}

export { Users, initUsers };
