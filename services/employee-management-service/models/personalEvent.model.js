const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class PersonalEvent extends Model {
        static associate(models) {
            PersonalEvent.belongsTo(models.user, {
                foreignKey: "user_id",
                as: "user",
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            });
        }
    }

    PersonalEvent.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            event_title: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            event_description: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            event_start_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            event_end_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users", // References the 'users' table
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
        },
        {
            sequelize, // Pass the Sequelize instance
            modelName: "PersonalEvent",
            tableName: "personal_event",
            timestamps: false,
            underscored: true,
        }
    );

    return PersonalEvent;
};
