import { Model, DataTypes } from "sequelize";
import { sequelize } from "./db";

export class Auth extends Model {}

Auth.init(
  {
    email: DataTypes.STRING,
    password: DataTypes.NUMBER,
    user_id: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "Auth",
  }
);
