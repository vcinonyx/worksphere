const { job: Job, Sequelize } = require("../models");
const { Op } = Sequelize;
const moment = require("moment");

const handleError = (res, err, message = "An error occurred") => {
  console.error(err);
  res.status(500).send({ message });
};

exports.create = async (req, res) => {
  try {
    const { jobTitle, startDate, endDate, userId } = req.body;

    if (!jobTitle || !startDate || !userId) {
      return res.status(400).send({ message: "Required fields are missing!" });
    }

    const newJob = {
      jobTitle,
      startDate: moment(startDate).format("YYYY-MM-DD HH:mm:ss"),
      endDate: endDate ? moment(endDate).format("YYYY-MM-DD HH:mm:ss") : null,
      userId,
    };

    const existingJob = await Job.findOne({
      where: {
        [Op.and]: [
          { userId },
          { startDate: { [Op.lte]: Date.now() } },
          {
            endDate: {
              [Op.or]: [{ [Op.gte]: Date.now() }, { [Op.is]: null }],
            },
          },
        ],
      },
    });

    if (existingJob && new Date(existingJob.endDate) > new Date(newJob.startDate)) {
      existingJob.endDate = moment(newJob.startDate).subtract(1, "days").format("YYYY-MM-DD HH:mm:ss");
      await existingJob.save();
    }

    const createdJob = await Job.create(newJob);
    res.send(createdJob);
  } catch (err) {
    handleError(res, err, "Error creating the Job.");
  }
};

exports.findAll = async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.send(jobs);
  } catch (err) {
    handleError(res, err, "Error retrieving jobs.");
  }
};

exports.findAllByUserId = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const jobs = await Job.findAll({ where: { userId } });
    res.send(jobs);
  } catch (err) {
    handleError(res, err, "Error retrieving jobs by User ID.");
  }
};

exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).send({ message: `Job with id=${id} not found.` });
    }

    res.send(job);
  } catch (err) {
    handleError(res, err, `Error retrieving Job with id=${req.params.id}.`);
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Job.update(req.body, { where: { id } });

    if (updated) {
      res.send({ message: "Job updated successfully." });
    } else {
      res.status(404).send({ message: `Cannot update Job with id=${id}. It may not exist.` });
    }
  } catch (err) {
    handleError(res, err, `Error updating Job with id=${req.params.id}.`);
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Job.destroy({ where: { id } });

    if (deleted) {
      res.send({ message: "Job deleted successfully!" });
    } else {
      res.status(404).send({ message: `Cannot delete Job with id=${id}. It may not exist.` });
    }
  } catch (err) {
    handleError(res, err, `Error deleting Job with id=${req.params.id}.`);
  }
};

exports.deleteAll = async (req, res) => {
  try {
    const deletedCount = await Job.destroy({ where: {}, truncate: false });
    res.send({ message: `${deletedCount} Jobs were deleted successfully!` });
  } catch (err) {
    handleError(res, err, "Error deleting all Jobs.");
  }
};

exports.deleteAllByUserId = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const deletedCount = await Job.destroy({ where: { userId }, truncate: false });
    res.send({ message: `${deletedCount} Jobs for User ID ${userId} were deleted successfully!` });
  } catch (err) {
    handleError(res, err, `Error deleting Jobs for User ID ${req.params.id}.`);
  }
};
