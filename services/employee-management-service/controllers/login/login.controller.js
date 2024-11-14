const db = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = db.user;
const Department = db.department;

exports.authenticate = (req, res) => {
    const { username, password } = req.body || {};

    if (!username || !password) {
        return res.status(400).send({
            message: "Username and password are required!"
        });
    }

    User.findOne({
        where: { username },
        include: [Department]
    })
        .then(user => {
            if (!user) {
                return res.status(403).send({ message: "Incorrect Credentials!" });
            }

            if (!user.active) {
                return res.status(403).send({ message: "Account is not active!" });
            }

            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                return res.status(403).send({ message: "Incorrect Credentials!" });
            }

            const departmentId = user.department ? user.department.id : null;
            const userData = {
                id: user.id,
                username: user.username,
                fullname: user.fullName,
                role: user.role,
                departmentId
            };

            jwt.sign(
                { user: userData },
                process.env.SECRET_KEY,
                { expiresIn: "30m" },
                (err, token) => {
                    if (err) {
                        return res.status(500).send({ message: "Error generating token" });
                    }

                    res.cookie("token", token);
                    res.status(200).send({ token });
                }
            );
        })
        .catch(() => {
            res.status(500).send({ message: "Server error occurred" });
        });
};
