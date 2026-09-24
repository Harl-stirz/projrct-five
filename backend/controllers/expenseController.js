const Expense = require("../models/expenseModel");
const db = require("../config/db");

const {
    createDeletedRecord
} = require("../models/deletedHistoryModel");


// ==========================================
// GET ALL EXPENSES
// ==========================================

const getExpenses = async (req, res) => {
    try {

        const expenses =
            await Expense.getAllExpenses();

        res.status(200).json(expenses);

    } catch (error) {

        console.error(
            "Get expenses error:",
            error
        );

        res.status(500).json({
            message: "Failed to get expenses",
            error: error.message
        });
    }
};


// ==========================================
// GET ONE EXPENSE
// ==========================================

const getExpense = async (req, res) => {
    try {

        const expense =
            await Expense.getExpenseById(
                req.params.id
            );

        if (!expense) {

            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json(expense);

    } catch (error) {

        console.error(
            "Get expense error:",
            error
        );

        res.status(500).json({
            message: "Failed to get expense",
            error: error.message
        });
    }
};


// ==========================================
// CREATE EXPENSE
// ==========================================

const addExpense = async (req, res) => {
    try {

        const {
            name,
            category,
            amount,
            date
        } = req.body || {};


        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            !name ||
            !category ||
            !amount ||
            !date
        ) {

            return res.status(400).json({
                message:
                    "Name, category, amount and date are required"
            });
        }


        if (Number(amount) <= 0) {

            return res.status(400).json({
                message:
                    "Amount must be greater than zero"
            });
        }


        // ==========================================
        // CREATE
        // ==========================================

        const result =
            await Expense.createExpense(
                name.trim(),
                category.trim(),
                Number(amount),
                date
            );


        res.status(201).json({

            message:
                "Expense added successfully",

            id:
                result.insertId

        });

    } catch (error) {

        console.error(
            "Add expense error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to add expense",

            error:
                error.message

        });
    }
};


// ==========================================
// UPDATE EXPENSE
// ==========================================

const editExpense = async (req, res) => {
    try {

        const {
            name,
            category,
            amount,
            date
        } = req.body || {};


        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            !name ||
            !category ||
            !amount ||
            !date
        ) {

            return res.status(400).json({
                message:
                    "Name, category, amount and date are required"
            });
        }


        if (Number(amount) <= 0) {

            return res.status(400).json({
                message:
                    "Amount must be greater than zero"
            });
        }


        // ==========================================
        // UPDATE
        // ==========================================

        const result =
            await Expense.updateExpense(
                req.params.id,
                name.trim(),
                category.trim(),
                Number(amount),
                date
            );


        // ==========================================
        // CHECK
        // ==========================================

        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({
                message:
                    "Expense not found"
            });
        }


        res.status(200).json({

            message:
                "Expense updated successfully"

        });

    } catch (error) {

        console.error(
            "Edit expense error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to update expense",

            error:
                error.message

        });
    }
};


// ==========================================
// DELETE EXPENSE
// ==========================================
//
// DELETE FLOW:
//
// Expense
//    ↓
// Save complete record
//    ↓
// deleted_history
//    ↓
// Delete from expenses
//    ↓
// Commit
//
// The expense can then be restored for
// the configured retention period.
// ==========================================

const removeExpense = async (req, res) => {

    const { id } = req.params;

    let connection;

    try {

        // ==========================================
        // 1. GET CONNECTION
        // ==========================================

        connection =
            await db.getConnection();


        // ==========================================
        // 2. START TRANSACTION
        // ==========================================

        await connection.beginTransaction();


        // ==========================================
        // 3. FIND EXPENSE
        // ==========================================

        const [rows] =
            await connection.query(
                `
                SELECT *
                FROM expenses
                WHERE id = ?
                `,
                [id]
            );


        // ==========================================
        // 4. CHECK EXPENSE EXISTS
        // ==========================================

        if (rows.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                message:
                    "Expense not found"
            });
        }


        const expense = rows[0];


        // ==========================================
        // 5. SAVE TO GENERAL DELETE HISTORY
        // ==========================================

        await createDeletedRecord(
            expense.id,
            "expense",
            expense,
            connection
        );


        // ==========================================
        // 6. DELETE ACTIVE EXPENSE
        // ==========================================

        const [deleteResult] =
            await connection.query(
                `
                DELETE FROM expenses
                WHERE id = ?
                `,
                [id]
            );


        // ==========================================
        // 7. MAKE SURE DELETE WORKED
        // ==========================================

        if (
            deleteResult.affectedRows !== 1
        ) {

            await connection.rollback();

            return res.status(400).json({
                message:
                    "Expense could not be deleted"
            });
        }


        // ==========================================
        // 8. COMMIT
        // ==========================================

        await connection.commit();


        // ==========================================
        // 9. RESPONSE
        // ==========================================

        return res.status(200).json({

            message:
                "Expense moved to delete history successfully",

            deletedExpense:
                expense

        });

    } catch (error) {

        // ==========================================
        // ROLLBACK IF ERROR
        // ==========================================

        if (connection) {

            try {
                await connection.rollback();
            } catch (rollbackError) {

                console.error(
                    "Rollback error:",
                    rollbackError
                );
            }
        }


        console.error(
            "Delete expense error:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to delete expense",

            error:
                error.message

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
// EXPORT CONTROLLERS
// ==========================================

module.exports = {

    getExpenses,
    getExpense,
    addExpense,
    editExpense,
    removeExpense

};