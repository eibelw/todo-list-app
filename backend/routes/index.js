const express = require("express");
const router = express.Router();
const prisma = require("@prisma/client");

const todolistRouter = require("./todolist");
const todoitemRouter = require("./todoitems");
const userRouter = require("./users");

router.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

router.use("/user", userRouter);
router.use("/todoitem", todoitemRouter);
router.use("/todolist", todolistRouter);

module.exports = router;
