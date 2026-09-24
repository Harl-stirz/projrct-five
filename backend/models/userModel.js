
const db = require("../config/db");


// ========================================
// CREATE USER
// ========================================

const createUser = async (
    name,
    email,
    password,
    role
) => {

    const sql = `
        INSERT INTO users
        (name, email, password, role, deleted_at)
        VALUES (?, ?, ?, ?, NULL)
    `;

    const [result] = await db.query(
        sql,
        [
            name,
            email,
            password,
            role || "user"
        ]
    );

    return result;
};


// ========================================
// FIND USER BY EMAIL
// ========================================

const findUserByEmail = async (email) => {

    const sql = `
        SELECT
            id,
            name,
            email,
            password,
            role,
            created_at,
            deleted_at
        FROM users
        WHERE email = ?
    `;

    const [rows] = await db.query(
        sql,
        [email]
    );

    return rows;
};


// ========================================
// GET ALL ACTIVE USERS
// ========================================

const getAllUsers = async () => {

    const sql = `
        SELECT
            id,
            name,
            email,
            role,
            created_at,
            deleted_at
        FROM users
        WHERE deleted_at IS NULL
        ORDER BY id DESC
    `;

    const [rows] = await db.query(sql);

    return rows;
};


// ========================================
// GET ALL DELETED USERS
// ========================================

const getDeletedUsers = async () => {

    const sql = `
        SELECT
            id,
            name,
            email,
            role,
            created_at,
            deleted_at
        FROM users
        WHERE deleted_at IS NOT NULL
        ORDER BY deleted_at DESC
    `;

    const [rows] = await db.query(sql);

    return rows;
};


// ========================================
// GET USER BY ID
// ========================================

const getUserById = async (id) => {

    const sql = `
        SELECT
            id,
            name,
            email,
            role,
            created_at,
            deleted_at
        FROM users
        WHERE id = ?
    `;

    const [rows] = await db.query(
        sql,
        [id]
    );

    return rows;
};


// ========================================
// UPDATE USER
// ========================================

const updateUser = async (
    id,
    name,
    email,
    role
) => {

    const sql = `
        UPDATE users
        SET
            name = ?,
            email = ?,
            role = ?
        WHERE id = ?
    `;

    const [result] = await db.query(
        sql,
        [
            name,
            email,
            role,
            id
        ]
    );

    return result;
};


// ========================================
// SOFT DELETE USER
// ========================================

const deleteUser = async (id) => {

    const sql = `
        UPDATE users
        SET deleted_at = NOW()
        WHERE id = ?
        AND deleted_at IS NULL
    `;

    const [result] = await db.query(
        sql,
        [id]
    );

    return result;
};


// ========================================
// RESTORE USER
// ========================================

const restoreUser = async (id) => {

    const sql = `
        UPDATE users
        SET deleted_at = NULL
        WHERE id = ?
        AND deleted_at IS NOT NULL
    `;

    const [result] = await db.query(
        sql,
        [id]
    );

    return result;
};


// ========================================
// PERMANENTLY DELETE USER
// ========================================

const permanentlyDeleteUser = async (id) => {

    const sql = `
        DELETE FROM users
        WHERE id = ?
    `;

    const [result] = await db.query(
        sql,
        [id]
    );

    return result;
};


// ========================================
// EXPORT
// ========================================

module.exports = {

    createUser,
    findUserByEmail,

    getAllUsers,
    getDeletedUsers,

    getUserById,

    updateUser,

    deleteUser,
    restoreUser,
    permanentlyDeleteUser

};

