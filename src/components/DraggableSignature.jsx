import { DndContext, useDraggable } from "@dnd-kit/core";
import { useRef, useState } from "react";

export default function DraggableSignature({ text, font, onDrop }) {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef(null);

  const Draggable = () => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id: "signature",
    });

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
      transition: "transform 0.1s ease",
    };

    return (
      <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
        {text}
      </div>
    );
  };

  const handleDragEnd = (event) => {
    const { delta } = event;

    if (!delta) return;

    const newX = position.x + delta.x;
    const newY = position.y + delta.y;

    setPosition({ x: newX, y: newY });

    if (onDrop) {
      onDrop({ x: newX, y: newY });
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div
        ref={containerRef}
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        <Draggable />
      </div>
    </DndContext>
  );
}
