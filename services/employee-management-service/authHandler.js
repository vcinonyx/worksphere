const jwt = require('jsonwebtoken');
const db = require("./models");
const User = db.user;

exports.checkToken = (req, res) => {
    const authHeader = req.headers['authorization'];

    if (typeof authHeader !== 'undefined') {
        const tokenParts = authHeader.split(' ');
        const accessToken = tokenParts[1];
        req.token = accessToken;

        jwt.verify(req.token, process.env.SECRET_KEY, (err, authPayload) => {
            if (err) {
                return res.status(403).send({message: 'Access denied: Wrong access token'});
            }
            res.status(201).send({message: 'Access granted!', authData: authPayload});
        });
    } else {
        res.status(401).send({message: 'Access denied: No token provided'});
    }
};

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (typeof authHeader !== 'undefined') {
        const tokenParts = authHeader.split(' ');
        const accessToken = tokenParts[1];
        req.token = accessToken;

        jwt.verify(req.token, process.env.SECRET_KEY, (err, authPayload) => {
            if (err) {
                return res.status(403).send({message: 'Access denied: Wrong access token'});
            }
            req.authData = authPayload;
            next();
        });
    } else {
        res.status(401).send({message: 'Access denied: No token provided'});
    }
};

exports.withAdminRole = (req, res, next) => {
    const authPayload = req.authData;

    User.findOne({ where: { id: authPayload.user.id } })
        .then(user => {
            if (!user) {
                return res.status(401).send({message: "Forbidden"});
            }
            if (user.role === "ROLE_ADMIN") {
                req.authData = authPayload;
                next();
            } else {
                res.status(401).send({message: "Access denied: Role can't access this api"});
            }
        });
};

exports.withAdminManagerRole = (req, res, next) => {
    const authPayload = req.authData;

    User.findOne({ where: { id: authPayload.user.id } })
        .then(user => {
            if (!user) {
                return res.status(401).send({message: "Forbidden"});
            }
            if (user.role === "ROLE_ADMIN" || user.role === "ROLE_MANAGER") {
                req.authData = authPayload;
                next();
            } else {
                res.status(401).send({message: "Access denied: Role can't access this api"});
            }
        });
};

exports.withManagerRole = (req, res, next) => {
    const authPayload = req.authData;

    User.findOne({ where: { id: authPayload.user.id } })
        .then(user => {
            if (!user) {
                return res.status(401).send({message: "Forbidden"});
            }
            if (user.role === "ROLE_MANAGER") {
                req.authData = authPayload;
                next();
            } else {
                res.status(401).send({message: "Access denied: Role can't access this api"});
            }
        });
};

exports.withEmployeeRole = (req, res, next) => {
    const authPayload = req.authData;

    User.findOne({ where: { id: authPayload.user.id } })
        .then(user => {
            if (!user) {
                return res.status(401).send({message: "Forbidden"});
            }
            if (user.role === "ROLE_EMPLOYEE") {
                req.authData = authPayload;
                next();
            } else {
                res.status(401).send({message: "Access denied: Role can't access this api"});
            }
        });
};
