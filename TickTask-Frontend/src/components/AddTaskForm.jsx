import { useState } from 'react';
import axiosInstance from '../utils/axiosInstence';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const AddTaskForm = ({ onTaskAdded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('To-Do');

    const handleSubmit = async e => {
        e.preventDefault();
        const newTask = {
            title,
            description,
            category,
            timestamp: new Date().toISOString(),
        };

        const response = await axiosInstance.post('/api/tasks', newTask);
        onTaskAdded(response.data);
        setTitle('');
        setDescription('');
        setCategory('To-Do');
    };

    return (
        <form onSubmit={handleSubmit} className="mb-8 flex gap-4">
            <Input
                type="text"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="p-2"
                required
                maxLength={50}
            />

            <Input
                type="text"
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="p-2"
                maxLength={200}
            />
            <Select onValueChange={setCategory} value={category}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="To-Do">To-Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
            </Select>

            <Button type="submit">Add Task</Button>
        </form>
    );
};

export default AddTaskForm;
