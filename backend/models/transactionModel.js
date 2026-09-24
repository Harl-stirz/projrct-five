
const db = require("../config/db");

// Get all transactions
const getAllTransactions = async () => {
    const [rows] = await db.query(
        "SELECT * FROM transactions ORDER BY date DESC, id DESC"
    );

    return rows;
};

// Get one transaction
const getTransactionById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM transactions WHERE id = ?",
        [id]
    );

    return rows[0];
};

// Create transaction
const createTransaction = async (
    name,
    category,
    date,
    amount,
    type
) => {
    const [result] = await db.query(
        `INSERT INTO transactions
        (name, category, date, amount, type)
        VALUES (?, ?, ?, ?, ?)`,
        [name, category, date, amount, type]
    );

    return result.insertId;
};

// Update transaction
const updateTransaction = async (
    id,
    name,
    category,
    date,
    amount,
    type
) => {
    const [result] = await db.query(
        `UPDATE transactions
        SET name = ?,
            category = ?,
            date = ?,
            amount = ?,
            type = ?
        WHERE id = ?`,
        [name, category, date, amount, type, id]
    );

    return result;
};

// Delete transaction
const deleteTransaction = async (id) => {
    const [result] = await db.query(
        "DELETE FROM transactions WHERE id = ?",
        [id]
    );

    return result;
};

module.exports = {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction
};

