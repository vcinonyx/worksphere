const { application: Application, user: User, Sequelize } = require("../models");
const { Op } = Sequelize;
const moment = require("moment");

exports.create = (req, res) => {
  const { reason, startDate, endDate, type, userId } = req.body || {};

  if (!req.body) {
    return res.status(400).send({ message: "Content cannot be empty!" });
  }

  const application = {
    reason,
    startDate,
    endDate,
    status: "pending",
    type,
    userId
  };

  Application.create(application)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
              err.message || "An error occurred while creating the Application.",
        });
      });
};

exports.findAll = (req, res) => {
  Application.findAll({ include: User })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
              err.message || "An error occurred while retrieving Applications.",
        });
      });
};

exports.findAllRecent = (req, res) => {
  Application.findAll({
    where: {
      [Op.and]: [
        {
          startDate: {
            [Op.gte]: moment().subtract(14, "days").toDate(),
          },
        },
        {
          startDate: {
            [Op.lte]: moment().add(7, "days").toDate(),
          },
        },
      ],
    },
    include: [User],
  })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message:
              err.message || "An error occurred while retrieving recent Applications.",
        });
      });
};

exports.findAllRecentAndDept = (req, res) => {
  const departmentId = req.params.id;

  Application.findAll({
    where: {
      [Op.and]: [
        {
          startDate: {
            [Op.gte]: moment().subtract(14, "days").toDate(),
          },
        },
        {
          startDate: {
            [Op.lte]: moment().add(7, "days").toDate(),
          },
        },
      ],
    },
    include: [
      {
        model: User,
        where: { departmentId },
      },
    ],
  })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message:
              err.message || "An error occurred while retrieving Applications for the department.",
        });
      });
};

exports.findAllRecentAndUser = (req, res) => {
  const userId = req.params.id;

  Application.findAll({
    where: {
      [Op.and]: [
        {
          startDate: {
            [Op.gte]: moment().subtract(14, "days").toDate(),
          },
        },
        {
          startDate: {
            [Op.lte]: moment().add(7, "days").toDate(),
          },
        },
      ],
    },
    include: [
      {
        model: User,
        where: { id: userId },
      },
    ],
  })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message:
              err.message || "An error occurred while retrieving Applications for the user.",
        });
      });
};

exports.findAllByDeptId = (req, res) => {
  const departmentId = req.params.id;

  Application.findAll({
    include: [
      {
        model: User,
        where: { departmentId },
      },
    ],
  })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
              err.message || "An error occurred while retrieving Applications for the department.",
        });
      });
};

// Retrieve all Applications by User Id
exports.findAllByUserId = (req, res) => {
  const userId = req.params.id;

  User.findByPk(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: "User not found." });
        }

        Application.findAll({
          include: [User],
          where: { userId },
        })
            .then((data) => {
              res.send(data);
            })
            .catch((err) => {
              res.status(500).send({
                message:
                    err.message || "An error occurred while retrieving User's Applications.",
              });
            });
      })
      .catch((err) => {
        res.status(500).send({ message: "An error occurred while checking User." });
      });
};

// Find a single Application by id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Application.findByPk(id)
      .then((data) => {
        if (!data) {
          return res.status(404).send({ message: `Application with id=${id} not found.` });
        }
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: "An error occurred while retrieving Application with id=" + id,
        });
      });
};

// Update an Application by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Application.update(req.body, {
    where: { id },
  })
      .then((num) => {
        if (num === 1) {
          res.send({ message: "Application updated successfully." });
        } else {
          res.send({
            message: `Cannot update Application with id=${id}. Maybe Application was not found or request body is empty!`,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message: "Error updating Application with id=" + id,
        });
      });
};

// Delete an Application by the specified id
exports.delete = (req, res) => {
  const id = req.params.id;

  Application.destroy({
    where: { id },
  })
      .then((num) => {
        if (num === 1) {
          res.send({ message: "Application deleted successfully!" });
        } else {
          res.send({
            message: `Cannot delete Application with id=${id}. Maybe it was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Could not delete Application with id=" + id,
        });
      });
};

// Delete all Applications
exports.deleteAll = (req, res) => {
  Application.destroy({ where: {}, truncate: false })
      .then((nums) => {
        res.send({ message: `${nums} Applications were deleted successfully!` });
      })
      .catch((err) => {
        res.status(500).send({
          message:
              err.message || "An error occurred while removing all Applications.",
        });
      });
};

exports.deleteAllByUserId = (req, res) => {
  const userId = req.params.id;

  Application.destroy({
    where: { userId },
    truncate: false,
  })
      .then((nums) => {
        res.send({ message: `${nums} Applications were deleted successfully!` });
      })
      .catch((err) => {
        res.status(500).send({
          message:
              err.message || "An error occurred while removing the User's Applications.",
        });
      });
};
