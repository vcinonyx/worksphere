const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class UserPersonalInfo extends Model {
    static associate(models) {
      UserPersonalInfo.belongsTo(models.user, {
        foreignKey: "user_id",
        as: "user",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }

  UserPersonalInfo.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        date_of_birth: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        id_number: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        address: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        city: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        country: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        mobile: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        phone: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: true,
          validate: { isEmail: true },
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
      },
      {
        sequelize,
        modelName: "UserPersonalInfo",
        tableName: "user_personal_info",
        timestamps: false,
        underscored: true,
      }
  );

  return UserPersonalInfo;
};
