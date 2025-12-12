import { ArrowUpRight } from "lucide-react";
import type { Note as NoteType } from "../types/types";
import { Link } from "react-router-dom";

interface NoteCardProps {
    note: NoteType,
    onDragStart: (e: React.DragEvent, id: string) => void,
    onDragEnter: (e: React.DragEvent, id: string) => void,
    onDragEnd: () => void,
}

export default function NoteCard({ note, onDragStart, onDragEnter, onDragEnd}: NoteCardProps) {
    const colors = ["bg-red-500", "bg-pink-500", "bg-purple-500", "bg-indigo-500", "bg-blue-500", "bg-cyan-500", "bg-teal-500", "bg-green-500", "bg-lime-500", "bg-yellow-500", "bg-amber-500", "bg-orange-500", "bg-gray-500", "bg-white"];

    return (
        <Link to={`/note/${note._id}`} className="w-50 h-60 bg-primary rounded-2xl cursor-pointer flex flex-col relative p-4"
            onDragStart={(e) => onDragStart(e, note._id)}
            onDragEnter={(e) => onDragEnter(e, note._id)}
            onDragEnd={onDragEnd}
            draggable
        >
            <ArrowUpRight />
            <div className="mt-auto">
                <div className="overflow-clip text-clip w-40 text-xl">{note.MainNoteText}</div>
                <div>subh</div>
            </div>
            <div className="flex flex-col absolute -right-2 overflow-clip top-4">
                {note.sub_notes.map((sbnote, index) => (
                    <div key={sbnote._id} className={`w-2 h-3 ${colors[(index) % colors.length]} mb-1 rounded-r-xs`}></div>
                ))}
            </div>
        </Link>
    )
}
