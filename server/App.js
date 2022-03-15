const { PrismaClient } = require('@prisma/client');
const express = require('express');
const cors = require('cors');

const port = 5000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json(), cors());

app.route('/api/todos')
  .get((req, res) => {
    async function main() {
      const allTodos = await prisma.todos.findMany();
      res.send(allTodos);
    }

    main()
      .catch((e) => {
        throw e;
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
  })
  .post((req, res) => {
    async function main() {
      await prisma.todos.create({
        data: {
          uuid: req.body.uuid,
          titre: req.body.titre,
          description: req.body.description,
          priorite: req.body.priorite,
          date: new Date(req.body.date)
        }
      });

      const allTodos = await prisma.todos.findMany();
      res.send(allTodos);
    }

    main()
      .catch((e) => {
        throw e;
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
  });

app.route('/api/todos/:uuid')
  .get((req, res) => {
    async function main() {
      const todo = await prisma.todos.findUnique({
        where: {
          uuid: req.params.uuid
        }
      });
      res.send(todo);
    }

    main()
      .catch((e) => {
        throw e;
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
  })
  .put((req, res) => {
    async function main() {
      const todo = await prisma.todos.update({
        where: { uuid: req.params.uuid },
        data: {
          titre: req.body.titre,
          description: req.body.description,
          priorite: req.body.priorite,
          date: req.body.date,
          isDone: req.body.isDone
        }
      });
      res.send(todo);
    }

    main()
      .catch((e) => {
        throw e;
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
  })
  .delete((req, res) => {
    async function main() {
      const todo = await prisma.todos.delete({
        where: { uuid: req.params.uuid }
      });
      res.send(todo);
    }

    main()
      .catch((e) => {
        throw e;
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
  });

app.listen(port, () => {
  console.log(`Back ToDoList listening on port ${port}`);
});
