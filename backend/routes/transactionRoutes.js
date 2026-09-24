const express = require("express");

const router = express.Router();

const transactionController = require("../controllers/transactionController");

// GET all transactions
router.get("/", transactionController.getTransactions);

// GET one transaction
router.get("/:id", transactionController.getTransaction);

// ADD transaction
router.post("/", transactionController.addTransaction);

// EDIT transaction
router.put("/:id", transactionController.editTransaction);

// DELETE transaction
router.delete("/:id", transactionController.removeTransaction);

module.exports = router;