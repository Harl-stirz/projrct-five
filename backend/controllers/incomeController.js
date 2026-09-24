const Income = require("../models/incomeModel");
const db = require("../config/db");

const {
    createDeletedRecord
} = require("../models/deletedHistoryModel");


// ========================================
// GET ALL INCOME
// ========================================

const getIncome = async (req, res) => {

    try {

        const income =
            await Income.getAllIncome();

        res.status(200).json(income);

    } catch (error) {

        console.error(
            "Get income error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to get income",
            error: error.message
        });

    }

};


// ========================================
// GET ONE INCOME
// ========================================

const getOneIncome = async (req, res) => {

    try {

        const income =
            await Income.getIncomeById(
                req.params.id
            );

        if (!income) {

            return res.status(404).json({
                message:
                    "Income not found"
            });

        }

        res.status(200).json(income);

    } catch (error) {

        console.error(
            "Get one income error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to get income",
            error: error.message
        });

    }

};


// ========================================
// CREATE INCOME
// ========================================

const addIncome = async (req, res) => {

    try {

        const {
            source,
            description,
            date,
            amount,
            status
        } = req.body || {};

        // ----------------------------------------
        // VALIDATION
        // ----------------------------------------

        if (
            !source ||
            !date ||
            !amount
        ) {

            return res.status(400).json({
                message:
                    "Source, date and amount are required"
            });

        }

        if (Number(amount) <= 0) {

            return res.status(400).json({
                message:
                    "Amount must be greater than zero"
            });

        }

        // ----------------------------------------
        // VALID STATUS
        // ----------------------------------------

        const validStatus =
            status === "Pending"
                ? "Pending"
                : "Received";

        // ----------------------------------------
        // CREATE
        // ----------------------------------------

        const id =
            await Income.createIncome(
                source.trim(),
                description
                    ? description.trim()
                    : null,
                date,
                Number(amount),
                validStatus
            );

        res.status(201).json({

            message:
                "Income added successfully",

            id

        });

    } catch (error) {

        console.error(
            "Add income error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to add income",
            error: error.message
        });

    }

};


// ========================================
// UPDATE INCOME
// ========================================

const editIncome = async (req, res) => {

    try {

        const {
            source,
            description,
            date,
            amount,
            status
        } = req.body || {};

        // ----------------------------------------
        // VALIDATION
        // ----------------------------------------

        if (
            !source ||
            !date ||
            !amount
        ) {

            return res.status(400).json({
                message:
                    "Source, date and amount are required"
            });

        }

        if (Number(amount) <= 0) {

            return res.status(400).json({
                message:
                    "Amount must be greater than zero"
            });

        }

        // ----------------------------------------
        // VALID STATUS
        // ----------------------------------------

        const validStatus =
            status === "Pending"
                ? "Pending"
                : "Received";

        // ----------------------------------------
        // UPDATE
        // ----------------------------------------

        const result =
            await Income.updateIncome(
                req.params.id,
                source.trim(),
                description
                    ? description.trim()
                    : null,
                date,
                Number(amount),
                validStatus
            );

        // ----------------------------------------
        // CHECK
        // ----------------------------------------

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message:
                    "Income not found"
            });

        }

        res.status(200).json({
            message:
                "Income updated successfully"
        });

    } catch (error) {

        console.error(
            "Edit income error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to update income",
            error: error.message
        });

    }

};


// ========================================
// DELETE INCOME
// ========================================
// Income is NOT permanently deleted.
//
// 1. Find income
// 2. Save it to deleted_history
// 3. Delete it from income
// 4. Commit everything
//
// If anything fails, everything is rolled back.
// ========================================

const removeIncome = async (req, res) => {

    const { id } = req.params;

    let connection;

    try {

        // ========================================
        // 1. GET DATABASE CONNECTION
        // ========================================

        connection =
            await db.getConnection();


        // ========================================
        // 2. START DATABASE TRANSACTION
        // ========================================

        await connection.beginTransaction();


        // ========================================
        // 3. GET INCOME BEFORE DELETE
        // ========================================

        const [rows] =
            await connection.query(
                `
                SELECT *
                FROM income
                WHERE id = ?
                `,
                [id]
            );

        const income = rows[0];


        // ========================================
        // 4. CHECK IF INCOME EXISTS
        // ========================================

        if (!income) {

            await connection.rollback();

            return res.status(404).json({
                message:
                    "Income not found"
            });

        }


        // ========================================
        // 5. SAVE FULL INCOME TO DELETE HISTORY
        // ========================================

        await createDeletedRecord(
            income.id,
            "income",
            income,
            connection
        );


        // ========================================
        // 6. DELETE FROM ACTIVE INCOME TABLE
        // ========================================

        const [deleteResult] =
            await connection.query(
                `
                DELETE FROM income
                WHERE id = ?
                `,
                [id]
            );


        // ========================================
        // 7. MAKE SURE DELETE WORKED
        // ========================================

        if (
            deleteResult.affectedRows === 0
        ) {

            await connection.rollback();

            return res.status(404).json({
                message:
                    "Income could not be deleted"
            });

        }


        // ========================================
        // 8. COMMIT TRANSACTION
        // ========================================

        await connection.commit();


        // ========================================
        // 9. SUCCESS RESPONSE
        // ========================================

        res.status(200).json({

            message:
                "Income moved to delete history successfully",

            deletedIncome:
                income

        });

    } catch (error) {

        // ========================================
        // ROLLBACK
        // ========================================

        if (connection) {

            await connection.rollback();

        }


        console.error(
            "Delete income error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to delete income",

            error:
                error.message

        });

    } finally {

        // ========================================
        // RELEASE CONNECTION
        // ========================================

        if (connection) {

            connection.release();

        }

    }

};


// ========================================
// EXPORT CONTROLLERS
// ========================================

module.exports = {

    getIncome,
    getOneIncome,
    addIncome,
    editIncome,
    removeIncome

};