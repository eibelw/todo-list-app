const { PrismaClient } = require("@prisma/client");
const { DateTime } = require("luxon");
const prisma = new PrismaClient();

async function main() {
  const duedate = DateTime.now().plus({ days: 3 }).toJSDate();

  //Seeding User
    const user = await prisma.user.create({
      data: {
        username: "user",
        email: "user@mail.com",
        password: "user123",
      },
    });

  //Seeding Todo list for testing API
  const todo_list = await prisma.todo_List.createMany({
    data: [
      {
        title: "Work",
        desc: "Todo list for work",
        priorities: 1,
        userId: 1,
      },
      {
        title: "Workout",
        desc: "Todo list for work",
        priorities: 3,
        userId: 1,
      },
      {
        title: "Groceries",
        desc: "Todo list for shopping groceries",
        priorities: 2,
        userId: 1,
      },
    ],
  });

  //Seeding Todo items for testing API
  const todo_items = await prisma.todo_Item.createMany({
    data: [
      {
        listId: 3,
        title: "Coding",
        desc: "Coding new project",
        due_date: duedate,
      },
      {
        listId: 3,
        title: "Excel",
        desc: "Update excel progress",
        due_date: duedate,
      },
      {
        listId: 4,
        title: "Running",
      },
      {
        listId: 4,
        title: "Push-up",
      },
      {
        listId: 5,
        title: "Milk",
        desc: "2 boxes of milk",
      },
      {
        listId: 5,
        title: "Rice",
        desc: "5kg of rice",
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
