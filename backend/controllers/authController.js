const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
    createUser,
    findUserByEmail
} = require("../models/userModel");


/*
    REGISTER
*/
const register = async (req, res) => {

    const {
        name,
        email,
        password
    } = req.body || {};

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Name, email and password are required."
        });
    }

    try {

        // Check if the email already exists
        const existingUsers =
            await findUserByEmail(email);

        if (existingUsers.length > 0) {
            return res.status(409).json({
                message:
                    "An account with this email already exists."
            });
        }

        // Hash the password
        const hashedPassword =
            await bcrypt.hash(password, 10);

        // Website registrations are always normal users
        const role = "user";

        // Create the user
        const result =
            await createUser(
                name,
                email,
                hashedPassword,
                role
            );

        res.status(201).json({
            message:
                "Account created successfully.",

            user: {
                id: result.insertId,
                name,
                email,
                role
            }
        });

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        res.status(500).json({
            message:
                "Could not create account.",
            error: error.message
        });
    }
};


/*
    LOGIN
*/
const login = async (req, res) => {

    console.log(
        "LOGIN REQUEST RECEIVED"
    );

    console.log(
        "Request body:",
        req.body
    );

    const {
        email,
        password
    } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({
            message:
                "Email and password are required."
        });
    }

    try {

        console.log(
            "ABOUT TO SEARCH FOR USER"
        );

        // Find the user in MySQL
        const users =
            await findUserByEmail(email);

        console.log(
            "USER SEARCH FINISHED"
        );

        console.log(
            "Users found:",
            users
        );

        // User does not exist
        if (users.length === 0) {
            return res.status(401).json({
                message:
                    "Invalid email or password."
            });
        }

        const user = users[0];

        // Compare entered password with bcrypt hash
        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                message:
                    "Invalid email or password."
            });
        }

        // Create JWT token
        const token =
            jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            );

        console.log(
            "LOGIN SUCCESS:",
            user.email,
            user.role
        );

        // Send token and user information
        res.json({
            message:
                "Login successful.",

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        res.status(500).json({
            message:
                "Login failed.",
            error: error.message
        });
    }
};


module.exports = {
    register,
    login
};