import { useEffect, useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimation,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import CategoryColumn from './CategoryColumn';
import AddTaskForm from './AddTaskForm';
import axiosInstance from '../utils/axiosInstence';
import { io } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import Task from './Task';

const TaskManagement = () => {
    const [tasks, setTasks] = useState([]);
    const [socket, setSocket] = useState(null);
    const [activeTask, setActiveTask] = useState(null); // Track the currently dragged task
    const { user } = useAuth();

    // Initialize Socket.IO connection
    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_BACKEND_URI, {
            withCredentials: true,
        });
        setSocket(newSocket);

        return () => newSocket.disconnect(); // Cleanup on unmount
    }, []);

    // Fetch tasks on component mount
    useEffect(() => {
        fetchTasks();
    }, []);

    // Listen for Socket.IO events
    useEffect(() => {
        if (!socket) return;

        // Listen for task creation
        socket.on('taskCreated', newTask => {
            setTasks(prevTasks => [...prevTasks, newTask]);
        });

        // Listen for task updates
        socket.on('taskUpdated', updatedTask => {
            setTasks(prevTasks =>
                prevTasks.map(task => (task._id === updatedTask._id ? updatedTask : task))
            );
        });

        // Listen for task deletion
        socket.on('taskDeleted', deletedTaskId => {
            setTasks(prevTasks => prevTasks.filter(task => task._id !== deletedTaskId));
        });

        // Listen for task reordering
        socket.on('tasksReordered', updatedTasks => {
            setTasks(updatedTasks); // Update the UI with the reordered tasks
        });

        // Cleanup listeners on unmount
        return () => {
            socket.off('taskCreated');
            socket.off('taskUpdated');
            socket.off('taskDeleted');
            socket.off('tasksReordered');
        };
    }, [socket]);

    // Fetch tasks from the backend
    const fetchTasks = async () => {
        try {
            const response = await axiosInstance.get('/api/tasks', {
                params: { userId: user?.uid }, // Pass the user ID
            });
            setTasks(response.data);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        }
    };

    // Handle task deletion
    const handleDeleteTask = async taskId => {
        try {
            await axiosInstance.delete(`/api/tasks/${taskId}`);
            setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    // Handle task editing
    const handleEditTask = updatedTask => {
        setTasks(prevTasks =>
            prevTasks.map(task => (task._id === updatedTask._id ? updatedTask : task))
        );
    };

    // Handle drag start
    const handleDragStart = event => {
        const { active } = event;
        const task = tasks.find(task => task._id === active.id);
        setActiveTask(task); // Set the currently dragged task
    };

    // Handle drag end
    const handleDragEnd = async event => {
        const { active, over } = event;

        if (!over) {
            setActiveTask(null);
            return;
        }

        const activeTask = tasks.find(task => task._id === active.id);
        const overTask = tasks.find(task => task._id === over.id);

        if (!activeTask) {
            setActiveTask(null);
            return;
        }

        // Determine the new category
        let newCategory;
        if (over.id.startsWith('category-')) {
            // Dragged over a category column
            newCategory = over.id.replace('category-', '');
        } else if (overTask) {
            // Dragged over a task in another category
            newCategory = overTask.category;
        } else {
            // Invalid drop target
            setActiveTask(null);
            return;
        }

        let updatedTasks;

        // If the task is moved to a new category
        if (activeTask.category !== newCategory) {
            // Step 1: Remove the task from the old category
            updatedTasks = tasks
                .filter(task => task._id !== activeTask._id) // Remove the active task temporarily
                .map(task => {
                    if (task.category === activeTask.category && task.order > activeTask.order) {
                        // Adjust the order of tasks in the old category
                        return { ...task, order: task.order - 1 };
                    }
                    return task;
                });

            // Step 2: Add the task to the new category
            const newCategoryTasks = updatedTasks.filter(task => task.category === newCategory);
            const newOrder = overTask ? overTask.order : newCategoryTasks.length;

            // Adjust the order of tasks in the new category
            updatedTasks = updatedTasks.map(task => {
                if (task.category === newCategory && task.order >= newOrder) {
                    return { ...task, order: task.order + 1 };
                }
                return task;
            });

            // Step 3: Add the active task to the new category with the updated order
            updatedTasks.push({ ...activeTask, category: newCategory, order: newOrder });
        } else {
            // Reorder tasks within the same category
            const categoryTasks = tasks.filter(task => task.category === newCategory);
            const oldIndex = categoryTasks.findIndex(task => task._id === activeTask._id);
            const newIndex = categoryTasks.findIndex(task => task._id === overTask._id);

            updatedTasks = arrayMove(categoryTasks, oldIndex, newIndex).map((task, index) => ({
                ...task,
                order: index,
            }));

            // Merge updated tasks with tasks from other categories
            updatedTasks = tasks.map(task => {
                if (task.category === newCategory) {
                    return updatedTasks.find(t => t._id === task._id) || task;
                }
                return task;
            });
        }

        // Optimistically update the UI
        setTasks(updatedTasks);

        // Send the updated tasks to the backend
        try {
            await axiosInstance.patch('/api/tasks/reorder', { tasks: updatedTasks });
        } catch (error) {
            console.error('Failed to reorder tasks:', error);
            // Revert the UI if the update fails
            setTasks(tasks);
        }

        setActiveTask(null);
    };
    // Get tasks by category
    const getTasksByCategory = category => tasks.filter(task => task.category === category);

    // Sensors for drag-and-drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <div className="p-8 min-h-screen">
            <AddTaskForm />
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex flex-col lg:flex-row gap-4">
                    <SortableContext items={tasks.map(task => task._id)}>
                        <CategoryColumn
                            id="category-To-Do" // Ensure this matches the format used in handleDragEnd
                            title="To-Do"
                            tasks={getTasksByCategory('To-Do')}
                            onDelete={handleDeleteTask}
                            onEdit={handleEditTask}
                        />
                        <CategoryColumn
                            id="category-In Progress"
                            title="In Progress"
                            tasks={getTasksByCategory('In Progress')}
                            onDelete={handleDeleteTask}
                            onEdit={handleEditTask}
                        />
                        <CategoryColumn
                            id="category-Done"
                            title="Done"
                            tasks={getTasksByCategory('Done')}
                            onDelete={handleDeleteTask}
                            onEdit={handleEditTask}
                        />
                    </SortableContext>
                </div>
                <DragOverlay dropAnimation={defaultDropAnimation}>
                    {activeTask ? (
                        <Task
                            task={activeTask}
                            onDelete={handleDeleteTask}
                            onEdit={handleEditTask}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default TaskManagement;
