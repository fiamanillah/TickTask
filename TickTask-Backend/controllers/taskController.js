const Task = require('../models/Task');

// Get all tasks
const getAllTasks = async (req, res) => {
    const { userId } = req.query; // Add userId to filter tasks by user

    try {
        // Fetch tasks sorted by category and order
        const tasks = await Task.find({ userId }).sort({ category: 1, order: 1 });
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new task
const createTask = async (req, res) => {
    const { title, description, category, userId } = req.body;

    try {
        // Find the last task in the same category to determine the new task's order
        const lastTask = await Task.findOne({ category, userId }).sort({ order: -1 });
        const newOrder = lastTask ? lastTask.order + 1 : 0;

        // Create the new task with the calculated order
        const newTask = new Task({ title, description, category, userId, order: newOrder });
        await newTask.save();

        // Emit a Socket.IO event to all clients
        req.io.emit('taskCreated', newTask); // Notify all clients about the new task

        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a task
const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, category, order } = req.body;

    try {
        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // If the category is being updated, reorder tasks in both the old and new categories
        if (category && task.category !== category) {
            // Remove the task from the old category
            await Task.updateMany(
                { category: task.category, order: { $gt: task.order }, userId: task.userId },
                { $inc: { order: -1 } }
            );

            // Add the task to the new category
            const lastTaskInNewCategory = await Task.findOne({
                category,
                userId: task.userId,
            }).sort({ order: -1 });
            const newOrderInNewCategory = lastTaskInNewCategory
                ? lastTaskInNewCategory.order + 1
                : 0;

            task.category = category;
            task.order = newOrderInNewCategory;
        }

        // If the order is being updated, reorder tasks in the same category
        if (order !== undefined && task.order !== order) {
            await Task.updateMany(
                { category: task.category, order: { $gte: order }, userId: task.userId },
                { $inc: { order: 1 } }
            );

            task.order = order;
        }

        // Update other fields
        if (title) task.title = title;
        if (description) task.description = description;

        await task.save();

        // Emit a Socket.IO event to all clients
        req.io.emit('taskUpdated', task);

        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// Delete a task
const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Remove the task and reorder the remaining tasks in the same category
        await Task.updateMany(
            { category: task.category, order: { $gt: task.order }, userId: task.userId },
            { $inc: { order: -1 } }
        );

        await Task.findByIdAndDelete(id);

        // Emit a Socket.IO event to all clients
        req.io.emit('taskDeleted', task._id); // Notify all clients about the deleted task

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Reorder tasks
const reorderTasks = async (req, res) => {
    const { tasks } = req.body;

    try {
        // Update the order and category of each task in the database
        await Promise.all(
            tasks.map(async task => {
                await Task.findByIdAndUpdate(task._id, {
                    order: task.order,
                    category: task.category,
                });
            })
        );

        // Fetch the updated tasks from the database
        const updatedTasks = await Task.find({ userId: tasks[0].userId }).sort({
            category: 1,
            order: 1,
        });

        // Emit the updated tasks array
        req.io.emit('tasksReordered', updatedTasks);

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
