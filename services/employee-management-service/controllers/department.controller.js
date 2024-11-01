const { department: Department, user: User, job: Job } = require("../models");

const handleError = (res, err, customMessage) => {
  console.error(err);
  res.status(500).send({ message: customMessage || err.message });
};

exports.create = async (req, res) => {
  try {
    const { departmentName, organizationId } = req.body;

    if (!departmentName || !organizationId) {
      return res.status(400).send({ message: "Required fields are missing!" });
    }

    const department = await Department.create({ departmentName, organizationId });
    res.send(department);
  } catch (err) {
    handleError(res, err, "An error occurred while creating the Department.");
  }
};

exports.findAll = async (req, res) => {
  try {
    const departments = await Department.findAll({
      include: [
        {
          model: User,
          include: {
            model: Job,
            include: User,
          },
        },
      ],
    });
    res.send(departments);
  } catch (err) {
    handleError(res, err, "An error occurred while retrieving departments.");
  }
};

exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findByPk(id, {
      include: [
        {
          model: User,
          include: {
            model: Job,
            include: User,
          },
        },
      ],
    });

    if (!department) {
      return res.status(404).send({ message: `Department with id=${id} not found.` });
    }

    res.send(department);
  } catch (err) {
    handleError(res, err, `Error retrieving Department with id=${req.params.id}.`);
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const [updated] = await Department.update(req.body, { where: { id } });

    if (updated) {
      res.send({ message: "Department updated successfully." });
    } else {
      res.status(404).send({
        message: `Cannot update Department with id=${id}. It may not exist or the request body is empty.`,
      });
    }
  } catch (err) {
    handleError(res, err, `Error updating Department with id=${req.params.id}.`);
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const users = await User.findAll({ where: { departmentId: id } });

    if (users.length > 0) {
      await Promise.all(
          users.map(async (user) => {
            user.departmentId = null;
            await user.save();
          })
      );
    }

    const deleted = await Department.destroy({ where: { id } });

    if (deleted) {
      res.send({ message: "Department deleted successfully!" });
    } else {
      res.status(404).send({
        message: `Cannot delete Department with id=${id}. It may not exist.`,
      });
    }
  } catch (err) {
    handleError(res, err, `Error deleting Department with id=${req.params.id}.`);
  }
};

exports.deleteAll = async (req, res) => {
  try {
    const deleted = await Department.destroy({ where: {}, truncate: false });
    res.send({ message: `${deleted} Departments were deleted successfully!` });
  } catch (err) {
    handleError(res, err, "An error occurred while deleting all Departments.");
  }
};
