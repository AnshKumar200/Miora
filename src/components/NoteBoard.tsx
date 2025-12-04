import { useEffect, useRef, useState } from "react"
import axios from "axios";
import AddNote from "./AddNote";
import type { Note as NoteType } from '../types/types'
import NoteCard from "./NoteCard";
import EditNote from "./EditNote";
import { CircleCheck, CircleX } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export default function NoteBoard() {
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
        const draggingIndex = notes.findIndex(n => n._id === draggingItem.current);
        const dragOverIndex = notes.findIndex(n => n._id === dragOverItem.current);

        if (draggingIndex === dragOverIndex) return;

        const updateNotes = [...notes];
        const temp = updateNotes[draggingIndex];
        updateNotes[draggingIndex] = updateNotes[dragOverIndex];
        updateNotes[dragOverIndex] = temp;

        setNotes(updateNotes);

        draggingItem.current = null;
        dragOverItem.current = null;

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

    const handleAdd = (noteData: { text: string }) => {
        const tempNote: NoteType = {
            ...noteData,
            _id: uuidv4(),
            order: notes.length,
            sub_notes: []
        }
        setNotes(prev => [...prev, tempNote]);
        setSyncNow(false)
    }

    const handleEdit = (note_id: string) => {
        setEditMenu(true);
        setClickedId(note_id)
    }

    const handleUpdate = () => {
        fetchNotes()
    }

    return (
        <div className="flex h-screen bg-background text-white p-5">
            <div className="w-full relative">
                <div className="absolute right-0 flex flex-col gap-5">
                    <button onClick={() => setAddMenu(!addMenu)} className={`bg-primary p-4 rounded-2xl ${addMenu ? "hidden" : ""}`}>Add note</button>
                    <button onClick={handleSync} className="bg-primary p-4 rounded-2xl flex gap-2">
                        <CircleCheck className={`${syncNow === true ? "text-green-300" : "hidden"}`} />
                        <CircleX className={`${syncNow === true ? "hidden" : "text-red-300"}`} />
                        <div>Sync</div>
                    </button>
                </div>

                <div className="flex gap-5 flex-wrap">
                    {notes.map(note => (
                        <NoteCard
                            key={note._id}
                            note={note}
                            onDragStart={handleDragStart}
                            onDragEnter={handleDragEnter}
                            onDragEnd={handleDragEnd}
                            onClick={handleEdit}
                        />
                    ))}
                </div>
            </div>
            <div className={`${editMenu === true ? "" : "hidden"} ml-auto`}>
                <EditNote NoteId={clickedId} onUpdate={handleUpdate}/>
            </div>
            <div className={`${addMenu === true ? "" : "hidden"} ml-auto`}>
                <AddNote onNoteAdd={handleAdd} closeAdd={() => setAddMenu(false)} />
            </div>
        </div>
    )
}
