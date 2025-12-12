import { useEffect, useRef, useState } from "react"
import axios from "axios";
import type { Note as NoteType } from '../types/types'
import { CircleCheck, CircleX } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import EditNote from "../components/EditNote";
import NoteCard from "../components/NoteCard";
import AddNote from "../components/AddNote";

export default function HomePage() {
    const [notes, setNotes] = useState<NoteType[]>([]);
    const [addMenu, setAddMenu] = useState(false);
    const [editMenu, setEditMenu] = useState(false);
    const [clickedId, setClickedId] = useState("");
    const [syncNow, setSyncNow] = useState(true);
    const draggingItem = useRef<string | null>(null);
    const dragOverItem = useRef<string | null>(null);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const resp = await axios.get<NoteType[]>(
                "http://localhost:7878/get_notes"
            );
            setNotes(resp.data.sort((a, b) => a.order - b.order));
        } catch (err) {
            console.log("Error fetching notes: ", err);
        }
    }

    const handleDragStart = (_: React.DragEvent, note_id: string) => {
        draggingItem.current = note_id;
    }

    const handleDragEnter = (_: React.DragEvent, note_id: string) => {
        dragOverItem.current = note_id;
    }

    const handleDragEnd = () => {
        const dragItem = draggingItem.current;
        const dragOver = dragOverItem.current;

        draggingItem.current = null;
        dragOverItem.current = null;

        if (!dragItem || !dragOver || dragItem === dragOver) return;

        const draggingIndex = notes.findIndex(n => n._id === dragItem);
        const dragOverIndex = notes.findIndex(n => n._id === dragOver);

        if (draggingIndex === -1 || dragOverIndex === -1) return;

        const updateNotes = [...notes];
        const temp = updateNotes[draggingIndex];
        updateNotes[draggingIndex] = updateNotes[dragOverIndex];
        updateNotes[dragOverIndex] = temp;

        setNotes(updateNotes);
        setSyncNow(false)
    }

    const handleSync = async () => {
        try {
            const updated = notes.map((n, index) => ({ ...n, order: index }));
            await axios.post("http://localhost:7878/sync_notes", updated);
            fetchNotes();
            setSyncNow(true)
            console.log("Synced!");
        } catch (err) {
            console.error("Note able to sync: ", err);
        }
    }

    const handleAdd = async (noteData: NoteType) => {
        const tempNote: NoteType = {
            _id: uuidv4(),
            MainNoteText: noteData.MainNoteText,
            order: notes.length,
            sub_notes: noteData.sub_notes
        }
        setNotes(prev => [...prev, tempNote]);
        setSyncNow(false)
    }

    const handleEdit = async (note_id: string) => {
        setClickedId(note_id)
        setEditMenu(true);
    }

    const handleUpdate = () => {
        fetchNotes()
    }

    return (
        <div className="flex flex-col">
            <div className="flex gap-5 ml-auto">
                <button onClick={() => setAddMenu(!addMenu)} className={`bg-primary p-4 rounded-2xl ${addMenu ? "hidden" : ""} text-nowrap`}>Add note</button>
                <button onClick={handleSync} className="bg-primary p-4 rounded-2xl flex gap-2">
                    <CircleCheck className={`${syncNow === true ? "text-green-300" : "hidden"}`} />
                    <CircleX className={`${syncNow === true ? "hidden" : "text-red-300"}`} />
                    <div>Sync</div>
                </button>
            </div>
            <div className="flex gap-5 flex-wrap">
                {notes && notes.map(note => (
                    <NoteCard
                        note={note}
                        onDragStart={handleDragStart}
                        onDragEnter={handleDragEnter}
                        onDragEnd={handleDragEnd}
                    />
                ))}
            </div>
        </div>
    )
}
