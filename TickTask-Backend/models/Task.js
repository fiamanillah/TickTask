const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 50,
    },
    description: {
        type: String,
        maxlength: 200,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    category: {
        type: String,
        enum: ['To-Do', 'In Progress', 'Done'],
        default: 'To-Do',
    },
    userId: { type: String, required: true }, // Store Firebase user ID
    order: { type: Number, default: 0 }, // New field to store the order of tasks
});

module.exports = mongoose.model('Task', taskSchema);
