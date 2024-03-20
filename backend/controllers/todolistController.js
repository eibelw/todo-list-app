const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const todolistController = {
  // Create new todo list
  createtodolist: async (req, res) => {
    try {
      const { title, desc, priorities, id } = req.body;
      const userId = await prisma.user.findUnique({
        where: { id },
      });

      if(!userId) {
        return res.status(500).json({ message: "User Id not found"})
      }

      const todolist = await prisma.todo_List.create({
        data: {
          title,
          desc,
          priorities,
          userId: userId.id,
        },
      });
      console.log("New Todo List has been created :", todolist);
      res.status(201).json(todolist);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  },

  //Get all todo lists
  gettodolist: async (req, res) => {
    try {
      const todolist = await prisma.todo_List.findMany();
      console.log("Searching all Todo list...");
      res.status(200).json(todolist);
    } catch (error) {
      console.error("Error fetching todo lists");
      res.status(500).json({ error: error.message });
    }
  },

  // Get todo list by Id
  gettodolistById: async (req, res) => {
    try {
      const { id } = req.params;
      const todolist = await prisma.todo_List.findUnique({
        where: { id: parseInt(id) },
      });

      if (!todolist) {
        return res.status(404).json({ message: "Todo list not available " });
      }

      console.log("Searching todo list by id...", todolist);
      res.status(200).json(todolist);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  //Update Todo List
  updatetodolist: async (req, res) => {
    const { id } = req.params;
    const { title, desc, priorities } = req.body;

    try {
      const todolist = await prisma.todo_List.update({
        where: { id: parseInt(id) },
        data: {
          title,
          desc,
          priorities,
        },
      });

      if (!todolist) {
        return res.status(404).json({ message: "Todo list not available " });
      }

      console.log("Todo list selected by Id was updated successfully to:", todolist);
      res.status(200).json(todolist);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  //Delete Todo List
  deletetodolist: async (req, res) => {
    const { id } = req.params;
    try {
      const todolist = await prisma.todo_List.delete({
        where: { id: parseInt(id) },
      });

      if (!todolist) {
        return res.status(404).json({ message: "Todo list not available " });
      }

      console.log("Todo list selected by Id was deleted successfully: ", todolist);
      res.status(200).json({ message: "Todo List deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = todolistController;
