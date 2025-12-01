import { useRef, useState } from "react"
import note_data from "../data/data.json"

export default function Note() {
    const [notes, setNotes] = useState(note_data);
    const draggingItem = useRef(null);
    const dragOverItem = useRef(null);

    const handleDragStart = (e, note_id) => {
        draggingItem.current = note_id;
        console.log(e.target.innerHTML);
    }

    const handleDragEnter = (e, note_id) => {
        dragOverItem.current = note_id;
        console.log(e.target.innerHTML);
    }

    const handleDragEnd = () => {
        const draggingIndex = notes.findIndex(n => n.id === draggingItem.current);
        const dragOverIndex = notes.findIndex(n => n.id === dragOverItem.current);

        if (draggingIndex === dragOverIndex) return;
        
        const updateNotes = [...notes];
        const temp = updateNotes[draggingIndex];
        updateNotes[draggingIndex] = updateNotes[dragOverIndex];
        updateNotes[dragOverIndex] = temp;

        setNotes(updateNotes);

        draggingItem.current = null;
        dragOverItem.current = null;
    }

    return (
        <div className="flex gap-10">
            {notes.map(note => (
                <div key={note.id} className="bg-amber-200 p-2"
                    onDragStart={(e) => handleDragStart(e, note.id)}
                    onDragEnter={(e) => handleDragEnter(e, note.id)}
                    onDragEnd={handleDragEnd}
                    draggable>
                    <div>{note.text}
                    </div>

                    <div className="flex flex-col gap-10">
                        {note.sub_notes.map(sbnote => (
                            <div key={sbnote.id} className="bg-red-200 p-2">
                                <div>{sbnote.id}</div>
                                <div>{sbnote.text}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
