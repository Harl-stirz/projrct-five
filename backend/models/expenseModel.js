const db = require("../config/db");


// ==========================================
// GET ALL EXPENSES
// ==========================================
const getAllExpenses = async () => {

    const [rows] = await db.query(`
        SELECT *
        FROM expenses
        ORDER BY date DESC, id DESC
    `);

    return rows;
};


// ==========================================
// GET ONE EXPENSE
// ==========================================
const getExpenseById = async (id) => {

    const [rows] = await db.query(
        `
        SELECT *
        FROM expenses
        WHERE id = ?
        LIMIT 1
        `,
        [id]
    );

    return rows[0] || null;
};


// ==========================================
// CREATE EXPENSE
// ==========================================
const createExpense = async (
    name,
    category,
    amount,
    date
) => {

    const [result] = await db.query(
        `
        INSERT INTO expenses
        (
            name,
            category,
            amount,
            date
        )
        VALUES (?, ?, ?, ?)
        `,
        [
            name,
            category,
            amount,
            date
        ]
    );

    return result;
};


// ==========================================
// UPDATE EXPENSE
// ==========================================
const updateExpense = async (
    id,
    name,
    category,
    amount,
    date
) => {

    const [result] = await db.query(
        `
        UPDATE expenses
        SET
            name = ?,
            category = ?,
            amount = ?,
            date = ?
        WHERE id = ?
        `,
        [
            name,
            category,
            amount,
            date,
            id
        ]
    );

    return result;
};


// ==========================================
// DELETE EXPENSE
// ==========================================
const deleteExpense = async (id) => {

    const [result] = await db.query(
        `
        DELETE FROM expenses
        WHERE id = ?
        `,
        [id]
    );

    return result;
};


module.exports = {
    getAllExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense
};