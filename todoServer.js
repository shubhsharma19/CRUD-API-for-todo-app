/** format
  [{
    "title": "title for todo",
    "id": "random id",
    "description": "description for the todo",
    "isCompleted": false
  },
  {
    "title": "title for todo",
    "id": "random id",
    "description": "description for the todo",
    "isCompleted": true
  }
]

dependencies install -> npm init -y; npm install express body-parser;
 */

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

let todosList = [];

app.use(bodyParser.json());

// return list of all todos
app.get('/todos', (req, res) => {
    res.json(todosList);
});

// Retrieve a specific todo item by ID
app.get('/todos/:id', (req, res) => {
  const targetTodo = findTodoByID(
    todosList, parseInt(req.params.id)
  );

  if (!targetTodo) {
    res.sendStatus(404);
  } else {
    res.json(targetTodo);
  }
});

// add a new todo
app.post('/todos', (req, res) => {
  const randomID = Math.floor(Math.random() * 100000) + 1;
  const newTodo = {
    "title": req.body.title,
    "id": randomID,
    "description": req.body.description,
    "isCompleted": req.body.isCompleted
  }

  todosList.push(newTodo);
  res.status(201).json(newTodo);
});

// update a specific todo by id 
app.put('/todos/:id', (req, res) => {
  const targetID = parseInt(req.params.id);
  const targetTodoIndex = todosList.findIndex(item => item.id === targetID);
  if (todoIndex === -1) {
    res.status(404).json({ error: "task not found!" });
  } else {
    todosList[targetTodoIndex].title = req.body.title;
    todosList[targetTodoIndex].description = req.body.description;
    todosList[targetTodoIndex].isCompleted = req.body.isCompleted;
    res.json({msg: "Todo completed!"});
  }
});

// delete a specific todo
app.delete('/todos/:id', (req, res) => {
  const targetID = parseInt(req.params.id);
  const targetTodoIndex = todosList.findIndex(item => item.id === targetID);
  if(todosList.length) {
    todosList.splice(targetTodoIndex, 1);
    res.status(200).json({"msg": "Deleted the todo!"});
  } else {
    res.status(404).json({error: "No todos found"});
  }
  
});

// for all other routes
app.all('*', (req, res) => {
  res.sendStatus(404);
})

function findTodoByID(todosList, targetID) {
  const targetTodoObject = todosList.find(
    item => item.id === targetID
  );
  return targetTodoObject;
}

app.listen(PORT);

module.exports = app;
