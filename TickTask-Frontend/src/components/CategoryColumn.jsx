import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import Task from './Task';

const CategoryColumn = ({ id, title, tasks }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className="flex-1 p-4 bg-card rounded-lg min-h-[200px]">
            <h2 className="text-lg font-bold mb-4">{title}</h2>
            <div className="space-y-2">
                <SortableContext items={tasks.map(task => task._id)}>
                    {tasks.map(task => (
                        <Task key={task._id} task={task} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
};

export default CategoryColumn;
