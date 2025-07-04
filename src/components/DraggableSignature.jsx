import { DndContext, useDraggable } from "@dnd-kit/core";

export default function DraggableSignature({ text, font, position, setPosition, onDrop }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: "signature" });

  const style = {
    position: "absolute",
    left: transform ? position.x + transform.x : position.x,
    top: transform ? position.y + transform.y : position.y,
    fontFamily: font,
    fontSize: 28,
    background: "rgba(255,255,255,0.7)",
    border: "1px dashed #888",
    padding: "4px 12px",
    borderRadius: 6,
    cursor: "grab",
    zIndex: 50,
    userSelect: "none",
    opacity: isDragging ? 0.7 : 1,
  };

  const handleDragEnd = (event) => {
    const { delta } = event;
    if (!delta) return;

    const newX = position.x + delta.x;
    const newY = position.y + delta.y;
    const newPos = { x: newX, y: newY };
    setPosition(newPos);
    if (onDrop) onDrop(newPos);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
        {text}
      </div>
    </DndContext>
  );
}
