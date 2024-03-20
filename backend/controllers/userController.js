const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userController = {
  // Create new user
  createuser: async (req, res) => {
    try {
      // //To check a valid email
      function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      }
      const { username, email, password } = req.body;

      if (!isValidEmail(email)) {
        console.log("Must be a valid email!");
        return res.status(422).json({ message: "Invalid email format" });
      }

      const hashedPassword = await bcrypt.hash(password, 8);

      const users = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });
      console.log("New user data created: ", users);
      res.status(201).json(users);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: error.message });
    }
  },

  //Login for user
  loginuser: async (req, res) => {
    try {
      const { password, email } = req.body;
      const users = await prisma.user.findFirst({
        where: { email },
      });

      if (!users) {
        return res.status(400).json({ message: "User not found" });
      }

      const passwordValid = await bcrypt.compare(password, users.password);

      if (!passwordValid) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const token = jwt.sign({ userId: users.id }, process.env.JWT_SECRET || "your-default-key", {
        expiresIn: "30m",
      });
      res.json({ token, users });
    } catch (error) {
      console.error("Login failed:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  //Logout User
  logoutuser: async (req, res) => {
    try {
      res.json({ message: "Logout successful" });
    } catch (error) {
      console.error("Logout error: ", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // Get all user
  getuser: async (req, res) => {
    try {
      const users = await prisma.user.findMany();
      console.log("Searching all user...");
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get user by id
  getuserById: async (req, res) => {
    const { id } = req.params;
    try {
      const users = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });

      if (!users) {
        return res.status(404).json({ message: "User not found " });
      }
      console.log(" Searching user by id...", users);
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update user by id
  updateuser: async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    try {
      const users = await prisma.user.update({
        where: { id: parseInt(id) },
        data: {
          username,
          email,
          password,
        },
      });

      if (!users) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log("New data user updated to:", users);
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete user by id
  deleteuser: async (req, res) => {
    const { id } = req.params;
    try {
      const users = await prisma.user.delete({
        where: { id: parseInt(id) },
      });

      if (!users) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log("Succesfully deleted user data by id: ", users);
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;
