const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Payment extends Model {
        static associate(models) {
            Payment.belongsTo(models.job, {
                foreignKey: "job_id",
                as: "job",
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            });
        }
    }

    Payment.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            payment_type: {
                type: DataTypes.ENUM("Check", "Bank Transfer", "Cash"),
                allowNull: false,
            },
            payment_month: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            payment_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            payment_fine: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            payment_amount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            comments: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            job_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "job", // Assumes a table named 'job' exists
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
        },
        {
            sequelize, // Pass the Sequelize instance
            modelName: "Payment",
            tableName: "payment",
            timestamps: false,
            underscored: true,
        }
    );

    return Payment;
};
