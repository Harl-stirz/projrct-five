const db = require("../config/db");

const {
    getAllDeletedIncome,
    getDeletedIncomeById,
    permanentlyDeleteIncome
} = require("../models/deletedIncomeModel");


// ========================================
// GET ALL DELETED INCOME
// ========================================

const getDeletedIncome = async (req, res) => {

    try {

        const income =
            await getAllDeletedIncome();

        res.status(200).json(income);

    } catch (error) {

        console.error(
            "Get deleted income error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to fetch deleted income"
        });

    }

};


// ========================================
// RESTORE INCOME
// ========================================

const restoreIncome = async (req, res) => {

    const { id } = req.params;

    let connection;

    try {

        const deletedIncome =
            await getDeletedIncomeById(id);


        if (!deletedIncome) {

            return res.status(404).json({
                message:
                    "Deleted income not found"
            });

        }


        // Check 30-day recovery period

        const deletedDate =
            new Date(
                deletedIncome.deleted_at
            );

        const currentDate =
            new Date();

        const difference =
            currentDate.getTime() -
            deletedDate.getTime();

        const thirtyDays =
            30 * 24 * 60 * 60 * 1000;


        if (difference >= thirtyDays) {

            await permanentlyDeleteIncome(id);

            return res.status(410).json({
                message:
                    "This income can no longer be restored because the 30-day recovery period has expired"
            });

        }


        connection =
            await db.getConnection();

        await connection.beginTransaction();


        // Restore income

        await connection.query(
            `INSERT INTO income
            (
                id,
                source,
                description,
                date,
                amount,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                deletedIncome.original_id,
                deletedIncome.source,
                deletedIncome.description,
                deletedIncome.date,
                deletedIncome.amount,
                deletedIncome.status
            ]
        );


        // Remove from delete history

        await connection.query(
            `DELETE FROM deleted_income
             WHERE id = ?`,
            [id]
        );


        await connection.commit();


        res.status(200).json({
            message:
                "Income restored successfully"
        });


    } catch (error) {

        if (connection) {
            await connection.rollback();
        }


        console.error(
            "Restore income error:",
            error
        );


        if (
            error.code ===
            "ER_DUP_ENTRY"
        ) {

            return res.status(409).json({
                message:
                    "This income already exists"
            });

        }


        res.status(500).json({
            message:
                "Failed to restore income"
        });


    } finally {

        if (connection) {
            connection.release();
        }

    }

};


// ========================================
// PERMANENTLY DELETE INCOME
// ========================================

const permanentlyDelete = async (
    req,
    res
) => {

    const { id } = req.params;

    try {

        const deletedIncome =
            await getDeletedIncomeById(id);


        if (!deletedIncome) {

            return res.status(404).json({
                message:
                    "Deleted income not found"
            });

        }


        await permanentlyDeleteIncome(id);


        res.status(200).json({
            message:
                "Income permanently deleted"
        });


    } catch (error) {

        console.error(
            "Permanent delete income error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to permanently delete income"
        });

    }

};


module.exports = {
    getDeletedIncome,
    restoreIncome,
    permanentlyDelete
};