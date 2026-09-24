
const express = require("express");

const router = express.Router();

const {
    getDeletedTransactions,
    restoreTransaction,
    permanentlyDelete
} = require("../controllers/deletedTransactionController");


// Get all deleted transactions
router.get(
    "/",
    getDeletedTransactions
);


// Restore a deleted transaction
router.post(
    "/:id/restore",
    restoreTransaction
);


// Permanently delete a transaction
router.delete(
    "/:id",
    permanentlyDelete
);


module.exports = router;

