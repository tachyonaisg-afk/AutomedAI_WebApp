import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

const DraggableRow = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes}>
      {/* Drag Handle */}
      <td {...listeners} style={{ cursor: "grab", width: "30px", textAlign: "center" }}>
        <GripVertical size={16} />
      </td>

      {children}
    </tr>
  );
};

export default DraggableRow;