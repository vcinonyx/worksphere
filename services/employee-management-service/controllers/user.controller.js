const { user: User, userPersonalInfo: UserPersonalInfo, userFinancialInfo: UserFinancialInfo, department: Department, job: Job, payment: Payment, Sequelize } = require("../models");
const bcrypt = require('bcrypt');

exports.create = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Content cannot be empty!" });
    }

    let hash = null;
    if (req.body.password) {
        hash = bcrypt.hashSync(req.body.password.toString(), 10);
    }

    const userData = {
        username: req.body.username,
        password: hash,
        fullName: req.body.fullname,
        role: req.body.role,
        active: true,
        departmentId: req.body.departmentId
    };

    User.findOne({ where: { username: userData.username } })
        .then(existingUser => {
            if (!existingUser) {
                User.create(userData)
                    .then(data => res.send(data))
                    .catch(err => {
                        res.status(500).send({
                            message: err.message || "Some error occurred while creating the User."
                        });
                    });
            } else {
                res.status(403).send({ message: "Username already exists" });
            }
        });
};

exports.findAll = (req, res) => {
    User.findAll({
        include: [UserPersonalInfo, UserFinancialInfo, Department, Job]
    })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving the Users."
            });
        });
};

exports.findTotal = (req, res) => {
    User.count()
        .then(data => res.send(data.toString()))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving the Users."
            });
        });
};

exports.findTotalByDept = (req, res) => {
    const departmentId = req.params.id;

    User.count({ where: { departmentId } })
        .then(data => res.send(data.toString()))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving the Users."
            });
        });
};

exports.findAllByDeptId = (req, res) => {
    const departmentId = req.params.id;

    User.findAll({
        where: { departmentId },
        include: [UserPersonalInfo, UserFinancialInfo, Department, Job]
    })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || `Some error occurred while retrieving the Users from the Department with Id: ${departmentId}`
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    User.findOne({
        include: [
            UserPersonalInfo,
            UserFinancialInfo,
            Department,
            {
                model: Job,
                include: [Payment]
            }
        ],
        where: { id }
    })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving User with id=" + id
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password.toString(), 10);
    }

    User.update(req.body, { where: { id } })
        .then(num => {
            if (num === 1) {
                res.send({ message: "User was updated successfully." });
            } else {
                res.send({
                    message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id=" + id
            });
        });
};

exports.changePassword = (req, res) => {
    const id = req.params.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).send({
            message: "Please send oldPassword and newPassword!"
        });
    }

    User.findOne({ where: { id } })
        .then(user => {
            if (user) {
                if (bcrypt.compareSync(oldPassword, user.password)) {
                    const hash = bcrypt.hashSync(newPassword, 10);
                    User.update({ password: hash }, { where: { id } })
                        .then(num => {
                            if (num === 1) {
                                res.send({ message: "User was updated successfully." });
                            } else {
                                res.send({
                                    message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
                                });
                            }
                        })
                        .catch(err => {
                            res.status(500).send({
                                message: "Error updating User with id=" + id
                            });
                        });
                } else {
                    res.status(400).send({ message: "Wrong Password" });
                }
            } else {
                res.status(400).send({ message: "No such user!" });
            }
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    User.destroy({ where: { id } })
        .then(num => {
            if (num === 1) {
                res.send({ message: "User was deleted successfully!" });
            } else {
                res.send({
                    message: `Cannot delete User with id=${id}. Maybe User was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
};

exports.deleteAll = (req, res) => {
    User.destroy({ where: {}, truncate: false })
        .then(nums => res.send({ message: `${nums} Users were deleted successfully!` }))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all Users."
            });
        });
};

exports.deleteAllByDeptId = (req, res) => {
    const departmentId = req.params.id;

    User.destroy({ where: { departmentId }, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} Users of Department with id=${departmentId} were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all Users."
            });
        });
};
