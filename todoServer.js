const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.json());

let todosList = [];

router.get('/todos', (req, res) => res.json(todosList));

router.get('/todos/:id', (req, res) => {
    const targetTodo = findTodoByID(todosList, parseInt(req.params.id));
    targetTodo ? res.json(targetTodo) : res.status(404).json({ error: "Todo not found!" });
});

router.post('/todos', (req, res) => {
    const randomID = Math.floor(Math.random() * 100000) + 1;
    const newTodo = { title: req.body.title, id: randomID, description: req.body.description, isCompleted: req.body.isCompleted || false };
    todosList.push(newTodo);
    res.status(201).json(newTodo);
});

router.put('/todos/:id', (req, res) => {
    const targetID = parseInt(req.params.id);
    const targetTodoIndex = todosList.findIndex(item => item.id === targetID);

    if (targetTodoIndex !== -1) {
        todosList[targetTodoIndex] = { ...todosList[targetTodoIndex], title: req.body.title, description: req.body.description, isCompleted: req.body.isCompleted };
        res.json({ msg: "Todo updated successfully!" });
    } else {
        res.status(404).json({ error: "Todo not found!" });
    }
});

router.delete('/todos/:id', (req, res) => {
    const targetID = parseInt(req.params.id);
    const targetTodoIndex = todosList.findIndex(item => item.id === targetID);

    if (targetTodoIndex !== -1) {
        todosList.splice(targetTodoIndex, 1);
        res.status(200).json({ msg: "Todo deleted successfully!" });
    } else {
        res.status(404).json({ error: "Todo not found!" });
    }
});

router.all('*', (req, res) => res.sendStatus(404));

function findTodoByID(todosList, targetID) {
    return todosList.find(item => item.id === targetID);
}

module.exports = router;
