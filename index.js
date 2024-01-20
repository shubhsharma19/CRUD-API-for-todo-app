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

const todosList = [];

app.use(bodyParser.json());

// add a todo
app.post('/todos', (req, res) => {
  
  // creating random id
  const randomID = Math.floor(Math.random() * 100000) + 1;
  // creating the object
  const todoObject = {
    "title": req.body.title,
    "id": randomID,
    "description": req.body.description,
    "isCompleted": req.body.isCompleted
  }
  todosList.push(todoObject);
  res.json(todosList);
});

// delete a specific todo
app.delete('/todos', (req, res) => {
  // todosList.pop();
  // res.status(201).json(todosList);
});

// return list of all todos
app.get('/todos', (req, res) => {
  res.status(200).json(todosList);
});

// retreive only a specific todo
app.get('/todos/:id', (req, res) => {

  let targetID = parseInt(req.params.id, 10);
  
  let targetTodo = findTodoByID(todosList, targetID);
  
  if (!targetTodo) {
    res.status(404).json({ error: "task not found!" });
  } else {
    res.status(200).json(targetTodo);
  }
});

// update a specific todo
app.put('/todos/:id', (req, res) => {

});

function findTodoByID(todoListArray, targetID) {
  const targetObject = todoListArray.find(
    item => item.id === targetID
  );
  return targetObject;
}

app.listen(PORT);
