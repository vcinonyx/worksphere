const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class User extends Model {
        static associate(models) {
            User.belongsTo(models.department, {
                foreignKey: "department_id",
                as: "department",
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            });

            User.hasOne(models.user_personal_info, {
                foreignKey: "user_id",
                as: "personalInfo",
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            });

            User.hasOne(models.user_financial_info, {
                foreignKey: "user_id",
                as: "financialInfo",
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            });

            User.hasMany(models.personal_event, {
                foreignKey: "user_id",
                as: "events",
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            });
        }
    }

    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            username: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: {
                    args: true,
                    msg: "This username is already taken!",
                },
                validate: {
                    notEmpty: { msg: "Username cannot be empty" },
                },
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "Password cannot be empty" },
                },
            },
            full_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            role: {
                type: DataTypes.ENUM("ROLE_ADMIN", "ROLE_MANAGER", "ROLE_EMPLOYEE"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_EMPLOYEE"]],
                        msg: "Invalid role provided.",
                    },
                },
            },
            active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            department_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "department", // Assumes the table name is 'department'
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
        },
        {
            sequelize,
            modelName: "User",
            tableName: "user",
            timestamps: false,
            underscored: true,
        }
    );

    return User;
};
