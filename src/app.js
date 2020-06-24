const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.get("/repositories/:id", (request, response) => {
  const id = request.params.id;
  const repository = repositories.find(repository => repository.id === id);
  return response.json(repository);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const id = request.params.id;
  const {title, url, techs} = request.body;

  const repository = repositories.find(repository => repository.id === id);
  if(repository == null) {
    return response.status(400).json('status: "erro"');
  }
  const index = repositories.indexOf(repository);
  repositories.splice(index, 1);
  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  repositories.splice(index,0,repository);   //Primeiro parâmetro é o index do vetor, o segundo são quantos itens vou DELETAR, os próximos são adição de itens
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const id = request.params.id;

  const repository = repositories.find(repository => repository.id === id);
  if(repository == null) {
    return response.status(400).json('status: "erro"');
  }
  const index = repositories.indexOf(repository);
  console.log(index);
  repositories.splice(index, 1);

  return response.status(204).json('');
});

app.post("/repositories/:id/like", (request, response) => {
  const id = request.params.id;
  
  const repository = repositories.find(repository => repository.id === id);
  if(repository == null) {
    return response.status(400).json('status: "erro"');
  }

  const likes = repository.likes;
  repositories.pop(repository);
  repository.likes = likes + 1;

  repositories.push(repository);
  return response.json(repository);
});

module.exports = app;
