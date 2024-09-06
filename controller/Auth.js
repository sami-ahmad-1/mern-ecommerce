


const passport = require('passport');
const { User } = require('../model/User');
const { sanitizeUser } = require("../services/Common")
const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'SECRET_KEY'



exports.createUser = async (req, res) => {
    try {
        const salt = crypto.randomBytes(16);
        crypto.pbkdf2(
            req.body.password,
            salt,
            310000,
            32,
            'sha256',
            async function (err, hashedPassword) {
                if (err) {
                    return res.status(500).json({ error: 'Error hashing password' });
                }
                const user = new User({
                    ...req.body,
                    password: hashedPassword.toString('hex'),
                    salt: salt.toString('hex')
                });

                const doc = await user.save();
                req.login(sanitizeUser(doc), (err) => {
                    if (err) {
                        res.status(400).json(err)
                    } else {
                        const token = jwt.sign(sanitizeUser(doc), SECRET_KEY);
                        res.cookie('jwt', token, { expires: new Date(Date.now() + 3600000), httpOnly: true })
                            .status(201).json(token);
                    }
                })
            });
    } catch (err) {
        res.status(400).json(err);
    }
};



exports.loginUser = async (req, res) => {
    res.cookie('jwt', req.user.token, { expires: new Date(Date.now() + 3600000), httpOnly: true })        
        .status(201).json(req.user)
}

exports.checkUser = async (req, res) => {
    res.json({ status: "Success", user: req.user })
}

