// this writes data into a file so that data is saved even after server is closed

// basically an offline version of todoServer

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const filePath = path.join(__dirname, '/todos.json');

// return list of all todos ✅
app.get('/todos', (req, res) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            res.status(500);
        }
        res.json(JSON.parse(data));
    })
});

// add a new todo ✅
app.post('/todos', (req, res) => {
    const randomID = Math.floor(Math.random() * 100000) + 1;
    const newTodo = {
        "title": req.body.title,
        "id": randomID,
        "description": req.body.description,
        "isCompleted": req.body.isCompleted
    }

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) throw err;
        const todosList = JSON.parse(data);
        todosList.push(newTodo);
        fs.writeFile(filePath, JSON.stringify(todosList), (err) => {
            if (err) throw err;
            res.json({ msg: "Added a todo successfully!" })
        })
    })
});

// Retrieve a specific todo item by ID ✅
app.get('/todos/:id', (req, res) => {
    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
            res.status(500);
        } else {
            let todosList = JSON.parse(data);
            const targetTodo = findTodoByID(todosList, parseInt(req.params.id));
            if (!targetTodo) {
                res.sendStatus(404);
            } else {
                res.json(targetTodo);
            }
        }
    })
});


// update a specific todo by id ✅
app.put('/todos/:id', (req, res) => {
    const targetID = parseInt(req.params.id);
    fs.readFile(filePath, "utf-8", (err, data) => {
        let todosList = JSON.parse(data);
        const targetTodoIndex = todosList.findIndex(item => item.id === targetID);
        if (targetTodoIndex === -1) {
            res.status(404).json({ error: "todo not found!" });
        } else {
            todosList[targetTodoIndex].title = req.body.title;
            todosList[targetTodoIndex].description = req.body.description;
            todosList[targetTodoIndex].isCompleted = req.body.isCompleted;
            fs.writeFile(filePath, JSON.stringify(todosList), (err) => {
                if (err) throw err;
                res.json(todosList);
            })
        }
    });
});

// delete a specific todo
app.delete('/todos/:id', (req, res) => {
    const targetID = parseInt(req.params.id);

    // reading the file for todolist array
    fs.readFile(filePath, "utf-8", (err, data) => {
        let todosList = JSON.parse(data);
        const targetTodoIndex = todosList.findIndex(item => item.id === targetID);
        if (targetTodoIndex === -1) {
            res.status(404).json({ error: "todo not found" });
        } else {
            if (todosList.length) {
                // splicing element from array
                todosList.splice(targetTodoIndex, 1);
                // writing to the file with updated array
                fs.writeFile(filePath, JSON.stringify(todosList), (err) => {
                    if (err) {
                        res.status(500);
                    }
                    res.status(200).json({ "msg": "Deleted the todo!" });
                })
            } else {
                res.status(400).json({ error: "todo list is empty!" });
            }
        }
    });
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
