const db = require("../config/db");

const {
    getAllBudgets,
    getBudgetById,
    createBudget,
    updateBudget
} = require("../models/budgetModel");


// ===============================
// GET ALL BUDGETS
// ===============================

const getBudgets = async (req, res) => {

    try {

        const budgets =
            await getAllBudgets();

        res.status(200).json(budgets);

    } catch (error) {

        console.error(
            "Get budgets error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to fetch budgets",
            error:
                error.message
        });

    }

};


// ===============================
// GET ONE BUDGET
// ===============================

const getSingleBudget = async (req, res) => {

    try {

        const { id } = req.params;

        const budget =
            await getBudgetById(id);


        if (!budget) {

            return res.status(404).json({
                message:
                    "Budget not found"
            });

        }


        res.status(200).json(budget);

    } catch (error) {

        console.error(
            "Get budget error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to fetch budget",
            error:
                error.message
        });

    }

};


// ===============================
// CREATE BUDGET
// ===============================

const addBudget = async (req, res) => {

    try {

        const {
            category,
            amount,
            spent
        } = req.body;


        // -------------------------------
        // CATEGORY VALIDATION
        // -------------------------------

        if (
            !category ||
            category.trim() === ""
        ) {

            return res.status(400).json({
                message:
                    "Category is required"
            });

        }


        // -------------------------------
        // AMOUNT VALIDATION
        // -------------------------------

        if (
            amount === undefined ||
            amount === null ||
            Number(amount) <= 0 ||
            isNaN(Number(amount))
        ) {

            return res.status(400).json({
                message:
                    "A valid budget amount is required"
            });

        }


        // -------------------------------
        // SPENT VALIDATION
        // -------------------------------

        const spentValue =
            spent === undefined ||
            spent === null ||
            spent === ""
                ? 0
                : Number(spent);


        if (
            isNaN(spentValue) ||
            spentValue < 0
        ) {

            return res.status(400).json({
                message:
                    "A valid spent amount is required"
            });

        }


        // -------------------------------
        // SPENT CANNOT EXCEED BUDGET
        // -------------------------------

        if (
            spentValue >
            Number(amount)
        ) {

            return res.status(400).json({
                message:
                    "Spent amount cannot be greater than budget amount"
            });

        }


        // -------------------------------
        // CREATE
        // -------------------------------

        const budget =
            await createBudget(
                category.trim(),
                Number(amount),
                spentValue
            );


        res.status(201).json({

            message:
                "Budget created successfully",

            budget

        });

    } catch (error) {

        console.error(
            "Create budget error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to create budget",
            error:
                error.message
        });

    }

};


// ===============================
// UPDATE BUDGET
// ===============================

const editBudget = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            category,
            amount,
            spent
        } = req.body;


        // -------------------------------
        // FIND EXISTING BUDGET
        // -------------------------------

        const existingBudget =
            await getBudgetById(id);


        if (!existingBudget) {

            return res.status(404).json({
                message:
                    "Budget not found"
            });

        }


        // -------------------------------
        // CATEGORY VALIDATION
        // -------------------------------

        if (
            !category ||
            category.trim() === ""
        ) {

            return res.status(400).json({
                message:
                    "Category is required"
            });

        }


        // -------------------------------
        // AMOUNT VALIDATION
        // -------------------------------

        if (
            amount === undefined ||
            amount === null ||
            Number(amount) <= 0 ||
            isNaN(Number(amount))
        ) {

            return res.status(400).json({
                message:
                    "A valid budget amount is required"
            });

        }


        // -------------------------------
        // SPENT VALIDATION
        // -------------------------------

        const spentValue =
            spent === undefined ||
            spent === null ||
            spent === ""
                ? 0
                : Number(spent);


        if (
            isNaN(spentValue) ||
            spentValue < 0
        ) {

            return res.status(400).json({
                message:
                    "A valid spent amount is required"
            });

        }


        // -------------------------------
        // SPENT CANNOT EXCEED BUDGET
        // -------------------------------

        if (
            spentValue >
            Number(amount)
        ) {

            return res.status(400).json({
                message:
                    "Spent amount cannot be greater than budget amount"
            });

        }


        // -------------------------------
        // UPDATE
        // -------------------------------

        const budget =
            await updateBudget(
                id,
                category.trim(),
                Number(amount),
                spentValue
            );


        res.status(200).json({

            message:
                "Budget updated successfully",

            budget

        });

    } catch (error) {

        console.error(
            "Update budget error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to update budget",
            error:
                error.message
        });

    }

};


// ===============================
// DELETE BUDGET
// ===============================

const removeBudget = async (req, res) => {

    let connection = null;

    let transactionStarted = false;


    try {

        const { id } = req.params;


        // =================================================
        // GET DATABASE CONNECTION
        // =================================================

        connection =
            await db.getConnection();


        // =================================================
        // GET BUDGET
        // =================================================

        const [rows] =
            await connection.query(
                `
                SELECT
                    id,
                    category,
                    amount,
                    spent,
                    created_at
                FROM budgets
                WHERE id = ?
                `,
                [id]
            );


        if (
            rows.length === 0
        ) {

            return res.status(404).json({
                message:
                    "Budget not found"
            });

        }


        const budget =
            rows[0];


        // =================================================
        // START TRANSACTION
        // =================================================

        await connection.beginTransaction();

        transactionStarted = true;


        // =================================================
        // SAVE TO DELETE HISTORY
        // =================================================

        await connection.query(
            `
            INSERT INTO deleted_history
            (
                record_id,
                record_type,
                record_data,
                deleted_at,
                expires_at
            )
            VALUES
            (
                ?,
                ?,
                ?,
                NOW(),
                DATE_ADD(NOW(), INTERVAL 30 DAY)
            )
            `,
            [
                budget.id,
                "budget",
                JSON.stringify(budget)
            ]
        );


        // =================================================
        // DELETE FROM ACTIVE BUDGETS
        // =================================================

        const [deleteResult] =
            await connection.query(
                `
                DELETE FROM budgets
                WHERE id = ?
                `,
                [id]
            );


        // =================================================
        // VERIFY DELETE
        // =================================================

        if (
            deleteResult.affectedRows === 0
        ) {

            throw new Error(
                "Budget could not be deleted"
            );

        }


        // =================================================
        // COMMIT
        // =================================================

        await connection.commit();

        transactionStarted = false;


        // =================================================
        // SUCCESS
        // =================================================

        res.status(200).json({

            message:
                "Budget deleted and moved to Delete History",

            budget

        });

    } catch (error) {

        // =================================================
        // ROLLBACK
        // =================================================

        if (
            connection &&
            transactionStarted
        ) {

            try {

                await connection.rollback();

            } catch (rollbackError) {

                console.error(
                    "Budget rollback error:",
                    rollbackError
                );

            }

        }


        console.error(
            "Delete budget error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to delete budget",

            error:
                error.message

        });

    } finally {

        // =================================================
        // RELEASE CONNECTION
        // =================================================

        if (connection) {

            connection.release();

        }

    }

};


// ===============================
// EXPORTS
// ===============================

module.exports = {

    getBudgets,

    getSingleBudget,

    addBudget,

    editBudget,

    removeBudget

};