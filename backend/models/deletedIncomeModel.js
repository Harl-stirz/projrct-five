const db = require("../config/db");


// ========================================
// GET ALL DELETED INCOME
// ========================================

const getAllDeletedIncome = async () => {

    const [rows] = await db.query(
        `SELECT *
         FROM deleted_income
         ORDER BY deleted_at DESC`
    );

    return rows;
};


// ========================================
// GET ONE DELETED INCOME
// ========================================

const getDeletedIncomeById = async (id) => {

    const [rows] = await db.query(
        `SELECT *
         FROM deleted_income
         WHERE id = ?`,
        [id]
    );

    return rows[0];
};


// ========================================
// CREATE DELETED INCOME
// ========================================

const createDeletedIncome = async (
    original_id,
    source,
    description,
    date,
    amount,
    status
) => {

    const [result] = await db.query(
        `INSERT INTO deleted_income
        (
            original_id,
            source,
            description,
            date,
            amount,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            original_id,
            source,
            description,
            date,
            amount,
            status
        ]
    );

    return result.insertId;
};


// ========================================
// PERMANENTLY DELETE
// ========================================

const permanentlyDeleteIncome = async (id) => {

    const [result] = await db.query(
        `DELETE FROM deleted_income
         WHERE id = ?`,
        [id]
    );

    return result;
};


// ========================================
// DELETE AFTER 30 DAYS
// ========================================

const deleteExpiredIncome = async () => {

    const [result] = await db.query(
        `DELETE FROM deleted_income
         WHERE deleted_at <
         DATE_SUB(NOW(), INTERVAL 30 DAY)`
    );

    return result;
};


module.exports = {
    getAllDeletedIncome,
    getDeletedIncomeById,
    createDeletedIncome,
    permanentlyDeleteIncome,
    deleteExpiredIncome
};