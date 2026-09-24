
const db = require("../config/db");
const Transaction = require("../models/transactionModel");

const {
    createDeletedRecord
} = require("../models/deletedHistoryModel");


// ==========================================
// GET ALL TRANSACTIONS
// ==========================================
const getTransactions = async (req, res) => {
    try {

        const transactions =
            await Transaction.getAllTransactions();

        res.status(200).json(transactions);

    } catch (error) {

        console.error(
            "Get transactions error:",
            error
        );

        res.status(500).json({
            message: "Failed to get transactions",
            error: error.message
        });
    }
};


// ==========================================
// GET ONE TRANSACTION
// ==========================================
const getTransaction = async (req, res) => {

    const { id } = req.params;

    try {

        const transaction =
            await Transaction.getTransactionById(id);

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        res.status(200).json(transaction);

    } catch (error) {

        console.error(
            "Get transaction error:",
            error
        );

        res.status(500).json({
            message: "Failed to get transaction",
            error: error.message
        });
    }
};


// ==========================================
// ADD TRANSACTION
// ==========================================
const addTransaction = async (req, res) => {

    const {
        name,
        category,
        date,
        amount,
        type
    } = req.body;

    try {

        const result =
            await Transaction.createTransaction(
                name,
                category,
                date,
                amount,
                type
            );

        res.status(201).json({
            message: "Transaction created successfully",
            id: result.insertId
        });

    } catch (error) {

        console.error(
            "Create transaction error:",
            error
        );

        res.status(500).json({
            message: "Failed to create transaction",
            error: error.message
        });
    }
};


// ==========================================
// EDIT TRANSACTION
// ==========================================
const editTransaction = async (req, res) => {

    const { id } = req.params;

    const {
        name,
        category,
        date,
        amount,
        type
    } = req.body;

    try {

        const result =
            await Transaction.updateTransaction(
                id,
                name,
                category,
                date,
                amount,
                type
            );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        res.status(200).json({
            message: "Transaction updated successfully"
        });

    } catch (error) {

        console.error(
            "Update transaction error:",
            error
        );

        res.status(500).json({
            message: "Failed to update transaction",
            error: error.message
        });
    }
};


// ==========================================
// DELETE TRANSACTION
// MOVES TRANSACTION TO GENERAL DELETE HISTORY
// ==========================================
const removeTransaction = async (req, res) => {

    const { id } = req.params;

    let connection;

    try {

        // ==========================================
        // GET DATABASE CONNECTION
        // ==========================================
        connection = await db.getConnection();

        // ==========================================
        // START DATABASE TRANSACTION
        // ==========================================
        await connection.beginTransaction();

        // ==========================================
        // 1. GET TRANSACTION BEFORE DELETING
        // ==========================================
        const [rows] = await connection.query(
            `
            SELECT *
            FROM transactions
            WHERE id = ?
            `,
            [id]
        );

        const transaction = rows[0];

        if (!transaction) {

            await connection.rollback();

            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        // ==========================================
        // 2. SAVE TRANSACTION TO DELETE HISTORY
        // ==========================================
        await createDeletedRecord(
            transaction.id,
            "transaction",
            transaction,
            connection
        );

        // ==========================================
        // 3. DELETE FROM ACTIVE TRANSACTIONS
        // ==========================================
        const [deleteResult] = await connection.query(
            `
            DELETE FROM transactions
            WHERE id = ?
            `,
            [id]
        );

        // ==========================================
        // VERIFY DELETE
        // ==========================================
        if (deleteResult.affectedRows === 0) {

            await connection.rollback();

            return res.status(404).json({
                message: "Transaction could not be deleted"
            });
        }

        // ==========================================
        // 4. COMMIT EVERYTHING
        // ==========================================
        await connection.commit();

        res.status(200).json({
            message:
                "Transaction moved to delete history successfully",
            deletedTransaction: transaction
        });

    } catch (error) {

        // ==========================================
        // ROLLBACK IF SOMETHING FAILS
        // ==========================================
        if (connection) {
            await connection.rollback();
        }

        console.error(
            "Delete transaction error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to delete transaction",
            error: error.message
        });

    } finally {

        // ==========================================
        // RELEASE CONNECTION
        // ==========================================
        if (connection) {
            connection.release();
        }
    }
};


// ==========================================
// EXPORT ALL CONTROLLERS
// ==========================================
module.exports = {
    getTransactions,
    getTransaction,
    addTransaction,
    editTransaction,
    removeTransaction
};

