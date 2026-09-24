const db = require("../config/db");

// Get all deleted transactions
const getAllDeletedTransactions = async () => {
    const [rows] = await db.query(
        `SELECT * FROM deleted_transactions
         ORDER BY deleted_at DESC`
    );

    return rows;
};


// Get one deleted transaction
const getDeletedTransactionById = async (id) => {
    const [rows] = await db.query(
        `SELECT * FROM deleted_transactions
         WHERE id = ?`,
        [id]
    );

    return rows[0];
};


// Add transaction to delete history
const createDeletedTransaction = async (
    original_id,
    name,
    category,
    date,
    amount,
    type
) => {

    const [result] = await db.query(
        `INSERT INTO deleted_transactions
        (original_id, name, category, date, amount, type)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            original_id,
            name,
            category,
            date,
            amount,
            type
        ]
    );

    return result.insertId;
};


// Permanently delete from history
const permanentlyDeleteTransaction = async (id) => {

    const [result] = await db.query(
        `DELETE FROM deleted_transactions
         WHERE id = ?`,
        [id]
    );

    return result;
};


// Delete transactions older than 30 days
const deleteExpiredTransactions = async () => {

    const [result] = await db.query(
        `DELETE FROM deleted_transactions
         WHERE deleted_at <
         DATE_SUB(NOW(), INTERVAL 30 DAY)`
    );

    return result;
};


module.exports = {
    getAllDeletedTransactions,
    getDeletedTransactionById,
    createDeletedTransaction,
    permanentlyDeleteTransaction,
    deleteExpiredTransactions
};