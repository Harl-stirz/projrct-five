
const deletedHistoryModel = require("../models/deletedHistoryModel");


// =================================================
// GET ALL DELETED RECORDS
// =================================================

const getDeletedHistory = async (req, res) => {

    try {

        const records =
            await deletedHistoryModel.getAllDeletedRecords();

        res.status(200).json(records);

    } catch (error) {

        console.error(
            "Get deleted history error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch deleted history"
        });

    }

};


// =================================================
// GET DELETED RECORDS BY TYPE
// =================================================

const getDeletedHistoryByType = async (req, res) => {

    try {

        const { type } = req.params;

        const records =
            await deletedHistoryModel.getDeletedRecordsByType(type);

        res.status(200).json(records);

    } catch (error) {

        console.error(
            "Get deleted history by type error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch deleted records"
        });

    }

};


// =================================================
// GET ONE DELETED RECORD
// =================================================

const getDeletedHistoryById = async (req, res) => {

    try {

        const { id } = req.params;

        const record =
            await deletedHistoryModel.getDeletedRecordById(id);

        if (!record) {

            return res.status(404).json({
                message: "Deleted record not found"
            });

        }

        res.status(200).json(record);

    } catch (error) {

        console.error(
            "Get deleted record error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch deleted record"
        });

    }

};


// =================================================
// RESTORE DELETED RECORD
// =================================================

const restoreDeletedItem = async (req, res) => {

    const { id } = req.params;

    try {

        const result =
            await deletedHistoryModel.restoreDeletedRecord(id);


        // Record doesn't exist
        if (!result) {

            return res.status(404).json({
                message: "Deleted record not found"
            });

        }


        // 30-day period expired
        if (result.expired) {

            return res.status(410).json({
                message:
                    "This record can no longer be restored because the 30-day recovery period has expired"
            });

        }


        res.status(200).json({
            message: "Record restored successfully",
            record: result.record
        });

    } catch (error) {

        console.error(
            "Restore deleted record error:",
            error
        );

        res.status(500).json({
            message: "Failed to restore record",
            error: error.message
        });

    }

};


// =================================================
// PERMANENTLY DELETE RECORD
// =================================================

const permanentlyDeleteItem = async (req, res) => {

    const { id } = req.params;

    try {

        const record =
            await deletedHistoryModel.getDeletedRecordById(id);


        if (!record) {

            return res.status(404).json({
                message: "Deleted record not found"
            });

        }


        const result =
            await deletedHistoryModel.permanentlyDeleteRecord(id);


        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Deleted record not found"
            });

        }


        res.status(200).json({
            message: "Record permanently deleted"
        });

    } catch (error) {

        console.error(
            "Permanent delete error:",
            error
        );

        res.status(500).json({
            message: "Failed to permanently delete record"
        });

    }

};


// =================================================
// DELETE EXPIRED RECORDS
// =================================================

const cleanupExpiredRecords = async (req, res) => {

    try {

        const result =
            await deletedHistoryModel.deleteExpiredRecords();

        res.status(200).json({
            message: "Expired records cleaned up",
            deletedCount: result.affectedRows
        });

    } catch (error) {

        console.error(
            "Cleanup expired records error:",
            error
        );

        res.status(500).json({
            message: "Failed to clean up expired records"
        });

    }

};


// =================================================
// EXPORTS
// =================================================

module.exports = {
    getDeletedHistory,
    getDeletedHistoryByType,
    getDeletedHistoryById,
    restoreDeletedItem,
    permanentlyDeleteItem,
    cleanupExpiredRecords
};

