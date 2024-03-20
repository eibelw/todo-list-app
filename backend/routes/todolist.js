const express = require("express");
const router = express.Router();

const todolistController = require("../controllers/todolistController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { authenticateToken } = require("../middleware/authMiddleware");

router.use(authMiddleware)
// router.use(authenticateToken);

router.get("/", todolistController.gettodolist);
router.get("/:id", todolistController.gettodolistById);
router.post("/create", todolistController.createtodolist);
router.put("/:id", todolistController.updatetodolist);
router.delete("/:id", todolistController.deletetodolist);

module.exports = router;
