const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3001;

app.use(cors({
    origin: ["http://localhost:3000", "https://to-do-app-prai.onrender.com"]
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const dataPath = './data/data.json';

// GET request to retrieve all tasks
app.get('/tasks', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    res.json(data);
});

// POST request to add a new task
app.post('/tasks', (req, res) => {
    const newTask = {
        id: Date.now(),
        status: 0,
        activity: req.body.activity // Use req.body.activity to access the "activity" field
    };
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    data.push(newTask);

    fs.writeFileSync(dataPath, JSON.stringify(data));

    res.json(newTask);
});

// PUT request to update a task
app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedTask = req.body;
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    const index = data.findIndex((task) => task.id === id);
    if (index !== -1) {
        data[index] = { ...data[index], ...updatedTask };
        fs.writeFileSync(dataPath, JSON.stringify(data));
        res.json(data[index]);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

// // DELETE request to remove a task
// app.delete('/tasks/:id', (req, res) => {
//     const id = parseInt(req.params.id);
//     const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
//
//     const index = data.findIndex((task) => task.id === id);
//     if (index !== -1) {
//         const deletedTask = data.splice(index, 1)[0];
//         fs.writeFileSync(dataPath, JSON.stringify(data));
//         res.json(deletedTask);
//     } else {
//         res.status(404).json({ error: 'Task not found' });
//     }
// });


// DELETE request to remove tasks with status 1
app.delete('/tasks', (req, res) => {
    let data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Find all tasks with status 1 and remove them
    const deletedTasks = data.filter((task) => task.status === 1);
    data = data.filter((task) => task.status !== 1);

    fs.writeFileSync(dataPath, JSON.stringify(data));
    res.json(deletedTasks);
});



app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
