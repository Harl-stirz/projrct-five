
const User = require("../models/userModel");


// ========================================
// CREATE USER
// ========================================

const createUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            role
        } = req.body;


        if (!name || !email || !password) {

            return res.status(400).json({
                message:
                    "Name, email and password are required"
            });

        }


        const existingUser =
            await User.findUserByEmail(email);


        if (existingUser.length > 0) {

            return res.status(409).json({
                message:
                    "A user with this email already exists"
            });

        }


        const result =
            await User.createUser(
                name,
                email,
                password,
                role || "user"
            );


        res.status(201).json({

            message:
                "User created successfully",

            userId:
                result.insertId

        });

    } catch (error) {

        console.error(
            "Create user error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to create user",

            error:
                error.message

        });

    }

};


// ========================================
// GET ACTIVE USERS
// ========================================

const getUsers = async (req, res) => {

    try {

        const users =
            await User.getAllUsers();


        res.status(200).json(users);

    } catch (error) {

        console.error(
            "Get users error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to get users",

            error:
                error.message

        });

    }

};


// ========================================
// GET DELETED USERS
// ========================================

const getDeletedUsers = async (req, res) => {

    try {

        const users =
            await User.getDeletedUsers();


        res.status(200).json(users);

    } catch (error) {

        console.error(
            "Get deleted users error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to get deleted users",

            error:
                error.message

        });

    }

};


// ========================================
// GET USER BY ID
// ========================================

const getUserById = async (req, res) => {

    try {

        const { id } =
            req.params;


        const users =
            await User.getUserById(id);


        if (users.length === 0) {

            return res.status(404).json({
                message:
                    "User not found"
            });

        }


        res.status(200).json(
            users[0]
        );

    } catch (error) {

        console.error(
            "Get user error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to get user",

            error:
                error.message

        });

    }

};


// ========================================
// UPDATE USER
// ========================================

const updateUser = async (req, res) => {

    try {

        const { id } =
            req.params;

        const {
            name,
            email,
            role
        } = req.body;


        if (!name || !email || !role) {

            return res.status(400).json({

                message:
                    "Name, email and role are required"

            });

        }


        const existingUser =
            await User.getUserById(id);


        if (existingUser.length === 0) {

            return res.status(404).json({

                message:
                    "User not found"

            });

        }


        const result =
            await User.updateUser(
                id,
                name,
                email,
                role
            );


        res.status(200).json({

            message:
                "User updated successfully",

            affectedRows:
                result.affectedRows

        });

    } catch (error) {

        console.error(
            "Update user error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to update user",

            error:
                error.message

        });

    }

};


// ========================================
// SOFT DELETE USER
// ========================================

const deleteUser = async (req, res) => {

    try {

        const { id } =
            req.params;


        const existingUser =
            await User.getUserById(id);


        if (existingUser.length === 0) {

            return res.status(404).json({

                message:
                    "User not found"

            });

        }


        const result =
            await User.deleteUser(id);


        if (result.affectedRows === 0) {

            return res.status(400).json({

                message:
                    "User is already deleted"

            });

        }


        res.status(200).json({

            message:
                "User moved to deleted users",

            affectedRows:
                result.affectedRows

        });

    } catch (error) {

        console.error(
            "Delete user error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to delete user",

            error:
                error.message

        });

    }

};


// ========================================
// RESTORE USER
// ========================================

const restoreUser = async (req, res) => {

    try {

        const { id } =
            req.params;


        const existingUser =
            await User.getUserById(id);


        if (existingUser.length === 0) {

            return res.status(404).json({

                message:
                    "User not found"

            });

        }


        const result =
            await User.restoreUser(id);


        if (result.affectedRows === 0) {

            return res.status(400).json({

                message:
                    "User is already active"

            });

        }


        res.status(200).json({

            message:
                "User restored successfully",

            affectedRows:
                result.affectedRows

        });

    } catch (error) {

        console.error(
            "Restore user error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to restore user",

            error:
                error.message

        });

    }

};


// ========================================
// PERMANENT DELETE
// ========================================

const permanentlyDeleteUser = async (
    req,
    res
) => {

    try {

        const { id } =
            req.params;


        const existingUser =
            await User.getUserById(id);


        if (existingUser.length === 0) {

            return res.status(404).json({

                message:
                    "User not found"

            });

        }


        const result =
            await User.permanentlyDeleteUser(id);


        res.status(200).json({

            message:
                "User permanently deleted",

            affectedRows:
                result.affectedRows

        });

    } catch (error) {

        console.error(
            "Permanent delete error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to permanently delete user",

            error:
                error.message

        });

    }

};


// ========================================
// EXPORT
// ========================================

module.exports = {

    createUser,

    getUsers,
    getDeletedUsers,

    getUserById,

    updateUser,

    deleteUser,
    restoreUser,
    permanentlyDeleteUser

};

