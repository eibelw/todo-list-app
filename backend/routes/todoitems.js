const express = require("express");
const router = express.Router();

const todoitemController = require("../controllers/todoitemController");
const { authMiddleware } = require('../middleware/authMiddleware')
const { authenticateToken } = require('../middleware/authMiddleware')

router.use(authMiddleware)
// router.use(authenticateToken)

router.get("/", todoitemController.gettodoitems);
router.get("/:id", todoitemController.gettodoitemsById);
router.post("/create", todoitemController.createtodoitems);
router.put("/:id", todoitemController.updatetodoitems);
router.delete("/:id", todoitemController.deletetodoitems);

module.exports = router;
