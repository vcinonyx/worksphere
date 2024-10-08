const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class UserFinancialInfo extends Model {
    static associate(models) {
      UserFinancialInfo.belongsTo(models.user, {
        foreignKey: "user_id",
        as: "user",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }

  UserFinancialInfo.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        employment_type: {
          type: DataTypes.ENUM("Full_Time", "Part_Time"),
          allowNull: true,
        },
        salary_basic: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        salary_net: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        bank_name: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        account_name: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        account_number: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        iban: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "users", // Assumes a table named 'users' exists
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
      },
      {
        sequelize, // Pass the Sequelize instance
        modelName: "UserFinancialInfo",
        tableName: "user_financial_info",
        timestamps: false,
        underscored: true,
      }
  );

  return UserFinancialInfo;
};
