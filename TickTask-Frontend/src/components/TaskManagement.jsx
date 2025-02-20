import { useEffect, useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import CategoryColumn from './CategoryColumn';
import AddTaskForm from './AddTaskForm';
import axiosInstance from '../utils/axiosInstence';

const TaskManagement = () => {
    const [tasks, setTasks] = useState([]);

    const handleTaskAdded = newTask => {
        setTasks([...tasks, newTask]);
    };

    const fetchTasks = async () => {
        const response = await axiosInstance.get('/api/tasks');
        setTasks(response.data);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = event => {
        const { active, over } = event;

        if (!over) return;

        const activeTask = tasks.find(task => task._id === active.id);
        const newCategory = over.id; // The new column ID

        if (activeTask.category !== newCategory) {
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task._id === active.id ? { ...task, category: newCategory } : task
                )
            );

            // Update the task in the backend
            axiosInstance
                .post(`/api/tasks/${active.id}`, { category: newCategory })
                .catch(error => console.error('Failed to update task category:', error));
        }
    };

    const getTasksByCategory = category => tasks.filter(task => task.category === category);

    return (
        <div className="p-8 min-h-screen">
            <AddTaskForm onTaskAdded={handleTaskAdded} />
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-4">
                    <SortableContext items={tasks.map(task => task._id)}>
                        <CategoryColumn
                            id="todo"
                            title="To-Do"
                            tasks={getTasksByCategory('To-Do')}
                        />
                        <CategoryColumn
                            id="in-progress"
                            title="In Progress"
                            tasks={getTasksByCategory('In Progress')}
                        />
                        <CategoryColumn id="done" title="Done" tasks={getTasksByCategory('Done')} />
                    </SortableContext>
                </div>
            </DndContext>
        </div>
    );
};

export default TaskManagement;
