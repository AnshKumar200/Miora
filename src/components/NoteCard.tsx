import type { Note as NoteType } from "../types/types";

interface NoteCardProps {
    note: NoteType,
    onDragStart: (e: React.DragEvent, id: string) => void,
    onDragEnter: (e: React.DragEvent, id: string) => void,
    onDragEnd: () => void,
    onClick: (id: string) => void;
}

export default function NoteCard({ note, onDragStart, onDragEnter, onDragEnd, onClick }: NoteCardProps) {
    return (
        <div key={note._id} className="bg-primary p-5 rounded-2xl w-50"
            onDragStart={(e) => onDragStart(e, note._id)}
            onDragEnter={(e) => onDragEnter(e, note._id)}
            onDragEnd={onDragEnd}
            onClick={() => onClick(note._id)}
            draggable>
            <div>{note.text}</div>
            <div className="flex flex-col gap-5 mt-5">
                {note.sub_notes.map(sbnote => (
                    <div key={sbnote._id} className="bg-secondary px-5 py-2 rounded-2xl">
                        <div>{sbnote.text}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
