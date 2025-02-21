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
import { useAuth } from '../contexts/AuthContext';

const AddTaskForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('To-Do');
    const { user } = useAuth();

    const handleSubmit = async e => {
        e.preventDefault();

        // Create the new task object
        const newTask = {
            title,
            description,
            category,
            timestamp: new Date().toISOString(),
            userId: user?.uid, // Use the authenticated user's ID
        };

        try {
            // Send the new task to the backend
            await axiosInstance.post('/api/tasks', newTask);

            // Reset the form fields
            setTitle('');
            setDescription('');
            setCategory('To-Do');
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-4 md:flex-row">
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

            <Button type="submit" className="w-full md:w-auto">
                Add Task
            </Button>
        </form>
    );
};

export default AddTaskForm;
