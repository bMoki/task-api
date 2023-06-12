import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();
export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const tasks = database.select("tasks");

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title || !description) {
        return res
          .writeHead(400)
          .end(
            JSON.stringify({ message: "Title and Description are required" })
          );
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert("tasks", task);
      return res.writeHead(201).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title || !description) {
        return res
          .writeHead(400)
          .end(
            JSON.stringify({ message: "Title and Description are required" })
          );
      }

      const task = database.findById("tasks", id);

      if (task) {
        database.update("tasks", id, {
          title,
          description,
          updated_at: new Date(),
        });
        return res.writeHead(204).end();
      }

      return res
        .writeHead(404)
        .end(JSON.stringify({ message: "Task does not exist" }));
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const task = database.findById("tasks", id);

      if (task) {
        database.delete("tasks", id);
        return res.writeHead(204).end();
      }

      return res
        .writeHead(404)
        .end(JSON.stringify({ message: "Task does not exist" }));
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      const task = database.findById("tasks", id);

      if (task) {
        database.update("tasks", id, {
          completed_at: new Date(),
          updated_at: new Date(),
        });
        return res.writeHead(204).end();
      }

      return res
        .writeHead(404)
        .end(JSON.stringify({ message: "Task does not exist" }));
    },
  },
];
