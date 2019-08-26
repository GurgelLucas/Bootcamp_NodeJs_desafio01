const express = require("express");

const server = express();
server.use(express.json());

projects = [];
let cont = 0;

server.use((req, res, next) => {
  cont += 1;

  console.log(`Quantidade de Requisições: ${cont}`);

  return next();
});

const checkIdExists = (req, res, next) => {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  if (!project) {
    res.status(400).json({ error: "Id project no exists" });
  }

  return next();
};

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  if (!projects.find(p => p.id == id)) {
    projects.push(project);

    return res.json(projects);
  } else return res.json({ error: "Id já existe" });
});

server.post("/projects/:id/tasks", checkIdExists, (req, res) => {
  const { id } = req.params;
  const { tasks } = req.body;

  projects[id] = projects.tasks.push(tasks);

  return res.json(projects);
});

server.put("/projects/:id", checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkIdExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.json({ message: `Project ${req.query.id} has been deleted` });
});

server.listen(3000);
