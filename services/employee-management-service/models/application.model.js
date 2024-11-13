const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Application extends Model {}

    Application.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            reason: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            startDate: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    isDate: true,
                    notNull: { msg: "Start date is required" },
                },
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    isDate: true,
                    notNull: { msg: "End date is required" },
                },
            },
            status: {
                type: DataTypes.ENUM("Approved", "Rejected", "Pending"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["Approved", "Rejected", "Pending"]],
                        msg: "Status must be one of 'Approved', 'Rejected', or 'Pending'",
                    },
                },
            },
            type: {
                type: DataTypes.ENUM("Normal", "Student", "Illness", "Marriage"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["Normal", "Student", "Illness", "Marriage"]],
                        msg: "Type must be one of 'Normal', 'Student', 'Illness', or 'Marriage'",
                    },
                },
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
