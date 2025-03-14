const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(morgan(function (tokens, req, res) {
  // If the method is POST, add the body of request,
  // otherwise use what's defined in 'tiny' format
  let str = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
  ].join(' ');

  if (req.method === 'POST') {
    str = `${str} ${JSON.stringify(req.body)}`;
  }

  return str;
}));

let personEntries = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  },
];

const generateId = () => {
  return Math.floor(Math.random() * 100000).toString();
}

app.get('/', (request, response) => {
  response.send('<h1>Hello world!</h1>');
});

app.get('/info', (request, response) => {
  const numPersons = personEntries.length;
  const dateString = new Date().toString();
  response.send(`<div><p>Phonebook has info for ${numPersons} people</p><p>${dateString}</p></div>`);
});

app.get('/api/persons', (request, response) => {
  response.json(personEntries);
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = personEntries.find(person => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  personEntries = personEntries.filter(person => person.id !== id);

  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    });
  }

  if (personEntries.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    });
  }

  let id = generateId();

  // Refresh id until it's unique
  while (personEntries.find(person => person.id === id)) {
    id = generateId();
  }

  const person = {
    id: id,
    name: body.name,
    number: body.number
  };

  personEntries = personEntries.concat(person);

  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
