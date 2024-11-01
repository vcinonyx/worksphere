const { userFinancialInfo: UserFinancialInfo, Sequelize } = require("../models");
const { Op } = Sequelize;

const handleError = (res, err, message = "An error occurred") => {
  console.error(err);
  res.status(500).send({ message });
};

exports.create = async (req, res) => {
  try {
    const {
      employment_type,
      salary_basic,
      salary_net,
      bank_name,
      account_name,
      account_number,
      iban,
      user_id,
    } = req.body;

    if (!user_id) {
      return res.status(400).send({ message: "User ID is required!" });
    }

    const existingInfo = await UserFinancialInfo.findOne({ where: { user_id } });

    if (existingInfo) {
      return res.status(403).send({ message: "Financial Information already exists for this User." });
    }

    const newInfo = await UserFinancialInfo.create({
      employment_type,
      salary_basic,
      salary_net,
      bank_name,
      account_name,
      account_number,
      iban,
      user_id,
    });

    res.send(newInfo);
  } catch (err) {
    handleError(res, err, "Error creating User Financial Information.");
  }
};

exports.findAll = async (req, res) => {
  try {
    const allInfo = await UserFinancialInfo.findAll({ include: "user" });
    res.send(allInfo);
  } catch (err) {
    handleError(res, err, "Error retrieving User Financial Information.");
  }
};

exports.findByUserId = async (req, res) => {
  try {
    const { id: user_id } = req.params;

    const userInfo = await UserFinancialInfo.findAll({ where: { user_id } });

    if (!userInfo.length) {
      return res.status(404).send({ message: `No Financial Information found for User ID=${user_id}.` });
    }

    res.send(userInfo);
  } catch (err) {
    handleError(res, err, "Error retrieving Financial Information by User ID.");
  }
};

exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const info = await UserFinancialInfo.findByPk(id, { include: "user" });

    if (!info) {
      return res.status(404).send({ message: `Financial Information with ID=${id} not found.` });
    }

    res.send(info);
  } catch (err) {
    handleError(res, err, `Error retrieving Financial Information with ID=${req.params.id}.`);
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const [updated] = await UserFinancialInfo.update(req.body, { where: { id } });

    if (updated) {
      res.send({ message: "User Financial Information was updated successfully." });
    } else {
      res.status(404).send({
        message: `Cannot update Financial Information with ID=${id}. It may not exist or the request body is empty.`,
      });
    }
  } catch (err) {
    handleError(res, err, `Error updating Financial Information with ID=${req.params.id}.`);
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await UserFinancialInfo.destroy({ where: { id } });

    if (deleted) {
      res.send({ message: "User Financial Information was deleted successfully!" });
    } else {
      res.status(404).send({ message: `Cannot delete Financial Information with ID=${id}. It may not exist.` });
    }
  } catch (err) {
    handleError(res, err, `Error deleting Financial Information with ID=${req.params.id}.`);
  }
};

exports.deleteAll = async (req, res) => {
  try {
    const deletedCount = await UserFinancialInfo.destroy({ where: {}, truncate: false });
    res.send({ message: `${deletedCount} User Financial Informations were deleted successfully!` });
  } catch (err) {
    handleError(res, err, "Error deleting all User Financial Informations.");
  }
};
