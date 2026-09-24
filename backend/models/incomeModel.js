const db = require("../config/db");


// ========================================
// GET ALL INCOME
// ========================================

const getAllIncome = async () => {

    const [rows] = await db.query(
        `SELECT *
         FROM income
         ORDER BY date DESC, id DESC`
    );

    return rows;
};


// ========================================
// GET ONE INCOME
// ========================================

const getIncomeById = async (id) => {

    const [rows] = await db.query(
        `SELECT *
         FROM income
         WHERE id = ?`,
        [id]
    );

    return rows[0];
};


// ========================================
// CREATE INCOME
// ========================================

const createIncome = async (
    source,
    description,
    date,
    amount,
    status
) => {

    const [result] = await db.query(
        `INSERT INTO income
        (
            source,
            description,
            date,
            amount,
            status
        )
        VALUES (?, ?, ?, ?, ?)`,
        [
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
// UPDATE INCOME
// ========================================

const updateIncome = async (
    id,
    source,
    description,
    date,
    amount,
    status
) => {

    const [result] = await db.query(
        `UPDATE income
         SET
            source = ?,
            description = ?,
            date = ?,
            amount = ?,
            status = ?
         WHERE id = ?`,
        [
            source,
            description,
            date,
            amount,
            status,
            id
        ]
    );

    return result;
};


// ========================================
// DELETE INCOME
// ========================================

const deleteIncome = async (id) => {

    const [result] = await db.query(
        `DELETE FROM income
         WHERE id = ?`,
        [id]
    );

    return result;
};


module.exports = {
    getAllIncome,
    getIncomeById,
    createIncome,
    updateIncome,
    deleteIncome
};