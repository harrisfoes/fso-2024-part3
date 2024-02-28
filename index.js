const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

morgan.token("my-data", (request, response) => {
  const body = request.body;
  return JSON.stringify(body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :my-data"
  )
);

app.get("/", (request, response) => {
  response.send("<h1>Hello</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log(id);
  const name = persons.find((person) => person.id === id);

  if (name) {
    response.json(name);
  } else {
    response.status(404).end();
  }
});

app.get("/info", (request, response) => {
  const phonebookSize = persons.length;
  const today = new Date().toString();
  response.send(
    `<p>Phonebook has info for ${phonebookSize} people</p> <p>${today}</p>`
  );
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  return Math.floor(Math.random() * 100000);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  // request is not allowed to suceed if
  // the name or number is missing
  if (!body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  // the name already exists in the phonebook {error: 'name must be unique'}
  if (persons.some((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);
  console.log(newPerson);
  response.json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
