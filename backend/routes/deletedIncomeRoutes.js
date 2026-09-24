const express = require("express");

const router = express.Router();

const {
    getDeletedIncome,
    restoreIncome,
    permanentlyDelete
} = require("../controllers/deletedIncomeController");


router.get(
    "/",
    getDeletedIncome
);


router.post(
    "/:id/restore",
    restoreIncome
);


router.delete(
    "/:id",
    permanentlyDelete
);


module.exports = router;