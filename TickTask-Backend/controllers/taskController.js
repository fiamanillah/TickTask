const Task = require('../models/Task');

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createTask = async (req, res) => {
    const { title, description, category } = req.body;
    const io = req.app.get('socketio');

    try {
        const newTask = new Task({ title, description, category });
        await newTask.save();

        io.emit('taskCreated', newTask); // Emit event

        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, category } = req.body;
    const io = req.app.get('socketio');

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title, description, category },
            { new: true }
        );

        io.emit('taskUpdated', updatedTask); // Emit event

        res.status(200).json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteTask = async (req, res) => {
    const { id } = req.params;
    const io = req.app.get('socketio');

    try {
        await Task.findByIdAndDelete(id);

        io.emit('taskDeleted', { id }); // Emit event

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const reorderTasks = async (req, res) => {
    const { tasks } = req.body;
    const io = req.app.get('socketio');

    try {
        await Promise.all(
            tasks.map(async task => {
                await Task.findByIdAndUpdate(task._id, { category: task.category });
            })
        );

        io.emit('tasksReordered', tasks); // Emit event

        res.status(200).json({ message: 'Tasks reordered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
    reorderTasks,
};
