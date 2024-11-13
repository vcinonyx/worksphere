const { payment: Payment, user: User, job: Job, userFinancialInfo: UserFinancialInfo, sequelize } = require("../models");

// Helper for error handling
const handleError = (res, err, message = "An error occurred") => {
    console.error(err);
    res.status(500).send({ message });
};

// Create and Save a new Payment
exports.create = async (req, res) => {
    try {
        const {
            paymentType,
            paymentMonth,
            paymentDate,
            paymentFine,
            paymentAmount,
            comments,
            jobId,
        } = req.body;

        if (!paymentType || !paymentMonth || !paymentDate || !paymentAmount || !jobId) {
            return res.status(400).send({ message: "Required fields are missing!" });
        }

        const payment = await Payment.create({
            paymentType,
            paymentMonth,
            paymentDate,
            paymentFine,
            paymentAmount,
            comments,
            jobId,
        });

        res.send(payment);
    } catch (err) {
        handleError(res, err, "Error creating the Payment.");
    }
};

// Retrieve all Payments
exports.findAll = async (req, res) => {
    try {
        const payments = await Payment.findAll();
        res.send(payments);
    } catch (err) {
        handleError(res, err, "Error retrieving payments.");
    }
};

// Retrieve all Payments by year, grouped by month
exports.findAllByYear = async (req, res) => {
    try {
        const { id: year } = req.params;

        const payments = await Payment.findAll({
            where: sequelize.where(sequelize.fn("YEAR", sequelize.col("payment_month")), year),
            attributes: [
                [sequelize.fn("monthname", sequelize.col("payment_month")), "month"],
                [sequelize.fn("sum", sequelize.col("payment_amount")), "expenses"],
            ],
            group: [sequelize.fn("month", sequelize.col("payment_month")), "month"],
        });

        res.send(payments);
    } catch (err) {
        handleError(res, err, "Error retrieving payments by year.");
    }
};

// Retrieve all Payments by Job Id
exports.findAllByJobId = async (req, res) => {
    try {
        const { id: jobId } = req.params;

        const payments = await Payment.findAll({ where: { jobId } });
        res.send(payments);
    } catch (err) {
        handleError(res, err, "Error retrieving payments by Job ID.");
    }
};

// Find a single Payment by id
exports.findOne = async (req, res) => {
    try {
        const { id } = req.params;

        const payment = await Payment.findByPk(id);

        if (!payment) {
            return res.status(404).send({ message: `Payment with id=${id} not found.` });
        }

        res.send(payment);
    } catch (err) {
        handleError(res, err, `Error retrieving Payment with id=${req.params.id}.`);
    }
};

// Retrieve all Payments related to a specific User
exports.findAllByUser = async (req, res) => {
    try {
        const { id: userId } = req.params;

        const payments = await Payment.findAll({
            include: [
                {
                    model: Job,
                    where: { userId },
                    include: [
                        {
                            model: User,
                            include: [UserFinancialInfo],
                        },
                    ],
                },
            ],
        });

        res.send(payments);
    } catch (err) {
        handleError(res, err, "Error retrieving payments for the user.");
    }
};

// Update a Payment by id
exports.update = async (req, res) => {
    try {
        const { id } = req.params;

        const [updated] = await Payment.update(req.body, { where: { id } });

        if (updated) {
            res.send({ message: "Payment was updated successfully." });
        } else {
            res.status(404).send({
                message: `Cannot update Payment with id=${id}. It may not exist or the request body is empty.`,
            });
        }
    } catch (err) {
        handleError(res, err, `Error updating Payment with id=${req.params.id}.`);
    }
};

// Delete a Payment by id
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Payment.destroy({ where: { id } });

        if (deleted) {
            res.send({ message: "Payment deleted successfully!" });
        } else {
            res.status(404).send({ message: `Cannot delete Payment with id=${id}. It may not exist.` });
        }
    } catch (err) {
        handleError(res, err, `Error deleting Payment with id=${req.params.id}.`);
    }
};

// Delete all Payments
exports.deleteAll = async (req, res) => {
    try {
        const deletedCount = await Payment.destroy({ where: {}, truncate: false });
        res.send({ message: `${deletedCount} Payments were deleted successfully!` });
    } catch (err) {
        handleError(res, err, "Error deleting all Payments.");
    }
};

// Delete all Payments by Job Id
exports.deleteAllByJobId = async (req, res) => {
    try {
        const { id: jobId } = req.params;

        const deletedCount = await Payment.destroy({ where: { jobId }, truncate: false });
        res.send({ message: `${deletedCount} Payments for Job ID ${jobId} were deleted successfully!` });
    } catch (err) {
        handleError(res, err, "Error deleting Payments by Job ID.");
    }
};
