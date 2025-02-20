import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Task = ({ task }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: task._id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="p-4 mb-2 bg-accent rounded-lg shadow-sm cursor-move"
        >
            <h3 className="font-semibold">{task.title}</h3>
            <p className="">{task.description}</p>
            <p className="text-xs">{task.timestamp}</p>
        </div>
    );
};

export default Task;
