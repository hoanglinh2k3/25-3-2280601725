const express = require("express");
const router = express.Router();
const InventoryController = require("../controllers/inventories");

router.get("/", InventoryController.getAllInventories);
router.get("/:id", InventoryController.getInventoryById);

router.post("/add-stock", InventoryController.addStock);
router.post("/remove-stock", InventoryController.removeStock);
router.post("/reservation", InventoryController.reservation);
router.post("/sold", InventoryController.sold);

module.exports = router;