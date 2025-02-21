import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import Task from './Task';

const CategoryColumn = ({ id, title, tasks, onDelete, onEdit }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className="flex-1 p-4 bg-card rounded-lg min-h-[200px] border border-border"
        >
            <h2 className="text-card-foreground mb-4">{title}</h2>
            <div className="space-y-2">
                <SortableContext items={tasks.map(task => task._id)}>
                    {tasks.map(task => (
                        <Task
                            key={task._id}
                            id={task._id} // Pass the id prop
                            task={task}
                            onDelete={onDelete}
                            onEdit={onEdit}
                        />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
};

export default CategoryColumn;
