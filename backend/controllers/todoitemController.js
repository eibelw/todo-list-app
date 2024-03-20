const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const todoitemController = {
  // Create new todo item
  createtodoitems: async (req, res) => {
    try {
      const { title, desc, id } = req.body;
      const listID = await prisma.todo_List.findUnique({
        where: { id },
      });

      if(!listID) {
        return res.status(500).json({ message: "List Id not found"})
      }

      const todoitem = await prisma.todo_Item.create({
        data: {
          title,
          desc,
          listId: listID.id,
        },
      });

      console.log("New Todo Item has been created:", todoitem);
      res.status(201).json(todoitem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all todo items
  gettodoitems: async (req, res) => {
    try {
      const todoitem = await prisma.todo_Item.findMany();
      console.log("Searching for all todo items...");
      res.status(200).json(todoitem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get todo items by id
  gettodoitemsById: async (req, res) => {
    const { id } = req.params;
    try {
      const todoitem = await prisma.todo_Item.findUnique({
        where: { id: parseInt(id) },
      });

      if (!todoitem) {
        return res.status(404).json({ message: "Todo item not available " });
      }

      console.log("Searching todo items by Id...", todoitem);
      res.status(200).json(todoitem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update todo items
  updatetodoitems: async (req, res) => {
    const { title, desc, status } = req.body;
    const { id } = req.params;

    try {
      const todoitem = await prisma.todo_Item.update({
        where: { id: parseInt(id) },
        data: {
          title,
          desc,
          status,
        },
      });
      console.log("Updated the selected todo item :", todoitem);
      res.status(200).json(todoitem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete todo items
  deletetodoitems: async (req, res) => {
    const { id } = req.params;
    try {
      const todoitem = await prisma.todo_Item.delete({
        where: { id: parseInt(id) },
      });

      console.log("Deleted the todo item selected by id: ", todoitem);
      res.status(200).json(todoitem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = todoitemController;
