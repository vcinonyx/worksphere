const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Application extends Model {
        static associate(models) {
            // Association with User model
            Application.belongsTo(models.user, {
                foreignKey: "user_id",
                as: "user",
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            });
        }
    }

    Application.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            reason: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "Reason cannot be empty" },
                },
            },
            start_date: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    isDate: { msg: "Start date must be a valid date" },
                },
            },
            end_date: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    isDate: { msg: "End date must be a valid date" },
                },
            },
            status: {
                type: DataTypes.ENUM("Approved", "Rejected", "Pending"),
                allowNull: false,
                defaultValue: "Pending",
                validate: {
                    isIn: {
                        args: [["Approved", "Rejected", "Pending"]],
                        msg: "Status must be either 'Approved', 'Rejected', or 'Pending'",
                    },
                },
            },
            type: {
                type: DataTypes.ENUM("Illness", "Other"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["Illness", "Other"]],
                        msg: "Type must be either 'Illness' or 'Other'",
                    },
                },
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "user", // Assumes 'user' table exists
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
        },
        {
            sequelize, // Pass the Sequelize instance
            modelName: "Application",
            tableName: "application",
            timestamps: false,
            underscored: true,
        }
    );

    return Application;
};
