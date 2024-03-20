const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");

const userController = require("../controllers/userController");

router.post("/create", userController.createuser);
router.post("/login", userController.loginuser);
router.post("/logout", authenticateToken, userController.logoutuser);
router.get("/", userController.getuser);
router.get("/:id", userController.getuserById);
router.put("/:id", authenticateToken, userController.updateuser);
router.delete("/:id", userController.deleteuser);

module.exports = router;
