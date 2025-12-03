import { useEffect, useRef, useState } from "react"
import axios from "axios";
import AddNote from "./AddNote";
import type { Note as NoteType } from '../types/types'

export default function Note() {
    const [notes, setNotes] = useState<NoteType[]>([]);
    const [addMenu, setAddMenu] = useState(false);
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
    }

    const handleSync = async () => {
        try {
            const updated = notes.map((n, index) => ({ ...n, order: index }));
            await axios.post("http://localhost:7878/update_notes", updated);
            fetchNotes();
            console.log("Synced!");
        } catch (err) {
            console.error("Note able to sync: ", err);
        }
    }

    const handleAdd = (noteData: { text: string }) => {
        const tempNote: NoteType = {
            ...noteData,
            _id: `temp-${Date.now()}`,
            order: notes.length,
            sub_notes: []
        }
        setNotes(prev => [...prev, tempNote]);
    }

    return (
        <div className="flex h-screen bg-background text-white p-5">
            <div className="w-full relative">
                <div className="absolute right-0 flex flex-col gap-5">
                    <button onClick={() => setAddMenu(!addMenu)} className="bg-primary p-4 rounded-2xl">Add note</button>
                    <button onClick={handleSync} className="bg-primary p-4 rounded-2xl">Sync</button>
                </div>

                <div className="flex gap-5">
                    {notes.map(note => (
                        <div key={note._id} className="bg-primary p-5 rounded-2xl"
                            onDragStart={(e) => handleDragStart(e, note._id)}
                            onDragEnter={(e) => handleDragEnter(e, note._id)}
                            onDragEnd={handleDragEnd}
                            draggable>
                            <div>{note.text}
                            </div>

                            <div className="flex flex-col gap-5 mt-5">
                                {note.sub_notes.map(sbnote => (
                                    <div key={sbnote._id} className="bg-secondary px-5 py-2 rounded-2xl">
                                        <div>{sbnote._id}</div>
                                        <div>{sbnote.text}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={`${addMenu === true ? "" : "hidden"} ml-auto`}>
                <AddNote onNoteAdd={handleAdd} />
            </div>
        </div>
    )
}
