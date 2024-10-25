const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class DepartmentAnnouncement extends Model {
        static associate(models) {
            DepartmentAnnouncement.belongsTo(models.department, {
                foreignKey: "department_id",
                as: "department",
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            });

            DepartmentAnnouncement.belongsTo(models.user, {
                foreignKey: "created_by_user_id",
                as: "createdBy",
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            });
        }
    }

    DepartmentAnnouncement.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            announcement_title: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "Announcement title cannot be empty" },
                },
            },
            announcement_description: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            created_by_user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "user", // Assumes 'user' table exists
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            department_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "department",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
        },
        {
            sequelize,
            modelName: "DepartmentAnnouncement",
            tableName: "department_announcement",
            timestamps: false,
            underscored: true,
        }
    );

    return DepartmentAnnouncement;
};
