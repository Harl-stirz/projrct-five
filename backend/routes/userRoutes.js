
const express = require("express");

const router = express.Router();

const {
    createUser,
    getUsers,
    getDeletedUsers,
    getUserById,
    updateUser,
    deleteUser,
    restoreUser,
    permanentlyDeleteUser
} = require("../controllers/userController");


// ========================================
// ACTIVE USERS
// ========================================

router.get(
    "/",
    getUsers
);


// ========================================
// DELETED USERS
// ========================================

router.get(
    "/deleted",
    getDeletedUsers
);


// ========================================
// CREATE USER
// ========================================

router.post(
    "/",
    createUser
);


// ========================================
// GET USER BY ID
// ========================================

router.get(
    "/:id",
    getUserById
);


// ========================================
// UPDATE USER
// ========================================

router.put(
    "/:id",
    updateUser
);


// ========================================
// SOFT DELETE USER
// ========================================

router.delete(
    "/:id",
    deleteUser
);


// ========================================
// RESTORE USER
// ========================================

router.put(
    "/:id/restore",
    restoreUser
);


// ========================================
// PERMANENT DELETE
// ========================================

router.delete(
    "/:id/permanent",
    permanentlyDeleteUser
);


module.exports = router;

