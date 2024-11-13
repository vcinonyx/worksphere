const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model")(sequelize);
db.userPersonalInfo = require("./userPersonalInfo.model")(sequelize);
db.userFinancialInfo = require("./userFinancialInfo.model")(sequelize);
db.personalEvent = require("./personalEvent.model")(sequelize);
db.department = require("./department.model")(sequelize);
db.departmentAnnouncement = require("./deptAnnouncement.model")(sequelize);
db.job = require("./job.model")(sequelize);
db.application = require("./application.model")(sequelize);
db.payment = require("./payment.model")(sequelize);

db.user.hasOne(db.userPersonalInfo, {
  foreignKey: { name: "user_id", allowNull: false },
  as: "personalInfo",
});
db.user.hasOne(db.userFinancialInfo, {
  foreignKey: { name: "user_id", allowNull: false },
  as: "financialInfo",
});
db.user.hasMany(db.personalEvent, {
  foreignKey: { name: "user_id", allowNull: false },
  as: "events",
  onDelete: "CASCADE",
  hooks: true,
});
db.user.hasMany(db.application, {
  foreignKey: { name: "user_id", allowNull: false },
  as: "applications",
  onDelete: "CASCADE",
  hooks: true,
});
db.user.hasMany(db.departmentAnnouncement, {
  foreignKey: { name: "created_by_user_id", allowNull: false },
  as: "announcements",
  onDelete: "CASCADE",
  hooks: true,
});
db.user.hasMany(db.job, {
  foreignKey: { name: "user_id", allowNull: false },
  as: "jobs",
  onDelete: "CASCADE",
  hooks: true,
});
db.user.belongsTo(db.department, {
  foreignKey: { name: "department_id", allowNull: true },
  as: "department",
});

db.userFinancialInfo.belongsTo(db.user, {
  foreignKey: { name: "user_id", allowNull: false },
  as: "user",
});

db.personalEvent.belongsTo(db.user, {
  foreignKey: { name: "user_id", allowNull: false },
  as: "user",
});

db.department.hasMany(db.user, {
  foreignKey: { name: "department_id", allowNull: true },
  as: "users",
  onDelete: "CASCADE",
  hooks: true,
});
db.department.hasMany(db.departmentAnnouncement, {
  foreignKey: { name: "department_id", allowNull: true },
  as: "announcements",
  onDelete: "CASCADE",
  hooks: true,
});

db.departmentAnnouncement.belongsTo(db.department, {
  foreignKey: { name: "department_id", allowNull: true },
  as: "department",
});
db.departmentAnnouncement.belongsTo(db.user, {
  foreignKey: { name: "created_by_user_id", allowNull: false },
  as: "createdBy",
});

db.job.belongsTo(db.user, {
  foreignKey: { name: "user_id", allowNull: false },
  as: "user",
});
db.job.hasMany(db.payment, {
  foreignKey: { name: "job_id", allowNull: true },
  as: "payments",
  onDelete: "CASCADE",
  hooks: true,
});

db.application.belongsTo(db.user, {
  foreignKey: { name: "user_id", allowNull: false },
  as: "user",
});

db.payment.belongsTo(db.job, {
  foreignKey: { name: "job_id", allowNull: true },
  as: "job",
});

module.exports = db;
