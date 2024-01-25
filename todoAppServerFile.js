const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const filePath = path.join(__dirname, '/minidatabase.json');

async function readData(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        throw error;
    }
}

async function writeData(filePath, data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data));
    } catch (error) {
        throw error;
    }
}

app.get('/todos', async (req, res) => {
    try {
        const data = await readData(filePath);
        res.json(data);
    } catch (error) {
        console.error('Error processing GET request:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.post('/todos', async (req, res) => {
    try {
        const todosList = await readData(filePath);
        const randomID = Math.floor(Math.random() * 100000) + 1;
        const newTodo = {
            title: req.body.title,
            id: randomID,
            description: req.body.description,
            isCompleted: req.body.isCompleted || false
        };

        todosList.push(newTodo);
        await writeData(filePath, todosList);
        res.status(201).json(newTodo);
    } catch (error) {
        console.error('Error processing POST request:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.get('/todos/:id', async (req, res) => {
    try {
        const data = await readData(filePath);
        const todosList = JSON.parse(data);
        const { id } = req.params;
        const targetID = parseInt(id);
        const targetTodo = findTodoByID(todosList, targetID);
        if (!targetTodo) {
            res.sendStatus(404);
        } else {
            res.json(targetTodo);
        }
    } catch (error) {
        console.error('Error processing GET by ID request:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.put('/todos/:id', async (req, res) => {
    try {
        const data = await readData(filePath);
        let todosList = JSON.parse(data);
        const { id } = req.params;
        const targetID = parseInt(id);
        const targetTodoIndex = todosList.findIndex(item => item.id === targetID);

        if (targetTodoIndex === -1) {
            res.status(404).json({ error: 'Todo not found!' });
        } else {
            todosList[targetTodoIndex] = {
                ...todosList[targetTodoIndex],
                title: req.body.title,
                description: req.body.description,
                isCompleted: req.body.isCompleted
            };

            await writeData(filePath, todosList);
            res.json({ msg: 'Todo updated successfully!' });
        }
    } catch (error) {
        console.error('Error processing PUT request:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.delete('/todos/:id', async (req, res) => {
    try {
        const data = await readData(filePath);
        let todosList = JSON.parse(data);
        const { id } = req.params;
        const targetID = parseInt(id);
        const targetTodoIndex = todosList.findIndex(item => item.id === targetID);

        if (targetTodoIndex === -1) {
            res.status(404).json({ error: 'Todo not found!' });
        } else {
            if (todosList.length) {
                todosList.splice(targetTodoIndex, 1);
                await writeData(filePath, todosList);
                res.status(204).json({ msg: 'Deleted the todo!' });
            } else {
                res.status(400).json({ error: 'Todo list is empty!' });
            }
        }
    } catch (error) {
        console.error('Error processing DELETE request:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.all('*', (req, res) => {
    res.sendStatus(404);
});

// global catch 
app.use((err, req, res, next) => {
    res.status(500).json({ msg: "Error 500" });
})

function findTodoByID(todosList, targetID) {
    return todosList.find(item => item.id === targetID);
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
