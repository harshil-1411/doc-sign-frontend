import { DndContext, useDraggable } from '@dnd-kit/core';
import { useRef, useState } from 'react';

export default function DraggableSignature({ text, font, onDrop }) {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef(null);

  const Draggable = () => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: 'signature' });
    const style = {
      position: 'absolute',
      left: transform ? position.x + transform.x : position.x,
      top: transform ? position.y + transform.y : position.y,
      fontFamily: font,
      fontSize: 28,
      background: 'rgba(255,255,255,0.7)',
      border: '1px dashed #888',
      padding: '4px 12px',
      borderRadius: 6,
      cursor: 'grab',
      zIndex: 10,
      userSelect: 'none',
      opacity: isDragging ? 0.7 : 1,
    };
    return (
      <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
        {text}
      </div>
    );
  };

  const handleDragEnd = (event) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = event.delta.x + position.x;
    const y = event.delta.y + position.y;
    setPosition({ x, y });
    if (onDrop) onDrop({ x, y });
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Draggable />
      </div>
    </DndContext>
  );
} 