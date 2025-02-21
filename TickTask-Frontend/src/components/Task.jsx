import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import axiosInstance from '../utils/axiosInstence';
import { Grip, Trash2, FilePenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';

const Task = ({ id, task, onDelete, onEdit }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id, // Use the id prop
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDescription, setEditedDescription] = useState(task.description);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleSave = async () => {
        try {
            const updatedTask = { ...task, title: editedTitle, description: editedDescription };
            await axiosInstance.put(`/api/tasks/${task._id}`, updatedTask);
            onEdit(updatedTask); // Notify parent component
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} className="mb-4">
            <Card className="bg-muted border border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <Input
                                type="text"
                                value={editedTitle}
                                onChange={e => setEditedTitle(e.target.value)}
                                className="w-full"
                            />
                        ) : (
                            <CardTitle>{task.title}</CardTitle>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setIsEditing(!isEditing)}
                            variant="outline"
                            size="icon"
                        >
                            <FilePenLine className="h-4 w-4" />
                        </Button>
                        <Button
                            onClick={() => onDelete(task._id)}
                            variant="destructive"
                            size="icon"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isEditing ? (
                        <div className="space-y-2">
                            <Input
                                type="text"
                                value={editedDescription}
                                onChange={e => setEditedDescription(e.target.value)}
                                className="w-full"
                            />
                            <div className="flex gap-2">
                                <Button onClick={handleSave} className="w-full">
                                    Save
                                </Button>
                                <Button
                                    onClick={() => setIsEditing(false)}
                                    variant="outline"
                                    className="w-full"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <CardDescription>{task.description}</CardDescription>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                        {new Date(task.timestamp).toLocaleString()}
                    </p>
                    <div {...listeners} className="cursor-move">
                        <Grip className="text-gray-500" />
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Task;
