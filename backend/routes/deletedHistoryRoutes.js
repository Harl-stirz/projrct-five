
const express = require("express");

const router = express.Router();

const {
    getDeletedRecords,
    getDeletedRecordsByType,
    getDeletedRecordById,
    restoreDeletedRecord,
    permanentlyDeleteRecord,
    deleteExpiredRecords
} = require("../controllers/deletedHistoryController");

// ==========================================
// GET ALL DELETED RECORDS
// ==========================================
router.get(
    "/",
    getDeletedRecords
);

// ==========================================
// GET DELETED RECORDS BY TYPE
// ==========================================
router.get(
    "/type/:type",
    getDeletedRecordsByType
);

// ==========================================
// DELETE EXPIRED RECORDS
// MUST COME BEFORE /:id
// ==========================================
router.delete(
    "/cleanup/expired",
    deleteExpiredRecords
);

// ==========================================
// GET ONE DELETED RECORD
// ==========================================
router.get(
    "/:id",
    getDeletedRecordById
);

// ==========================================
// RESTORE DELETED RECORD
// ==========================================
router.post(
    "/:id/restore",
    restoreDeletedRecord
);

// ==========================================
// PERMANENTLY DELETE HISTORY RECORD
// ==========================================
router.delete(
    "/:id",
    permanentlyDeleteRecord
);

module.exports = router;

