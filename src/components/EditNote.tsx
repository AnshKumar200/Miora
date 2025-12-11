import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import type { Note as NoteType } from "../types/types";
import axios from "axios";
import { X } from "lucide-react";

interface EditNoteProps {
    NoteId: string,
    onUpdate: () => void,
    closeEdit: () => void;
}

export default function EditNote({ NoteId, onUpdate, closeEdit }: EditNoteProps) {
    const [noteData, setNoteData] = useState<NoteType>();
    const colors = ["bg-red-500", "bg-pink-500", "bg-purple-500", "bg-indigo-500", "bg-blue-500", "bg-cyan-500", "bg-teal-500", "bg-green-500", "bg-lime-500", "bg-yellow-500", "bg-amber-500", "bg-orange-500", "bg-gray-500", "bg-white"];

    useEffect(() => {
        if (NoteId) {
            getNoteData()
        }
    }, [NoteId]);

    const getNoteData = async () => {
        try {
            const resp = await axios.get(
                "http://localhost:7878/find_note", {
                params: {
                    id: NoteId
                }
            })
            setNoteData(resp.data[0]);
        } catch (err) {
            console.log("Error getting note data: ", err)
        }
    }

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!noteData) return;
        setNoteData({ ...noteData, MainNoteText: e.target.value })
    }

    const handleSubTextChange = (e: ChangeEvent<HTMLInputElement>, subId: string) => {
        if (!noteData) return;
        const updatedSubNotes = noteData.sub_notes.map(note => note._id === subId ? { ...note, text: e.target.value } : note);
        setNoteData({ ...noteData, sub_notes: updatedSubNotes })
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!noteData) return;

        try {
            await axios.post("http://localhost:7878/update_note", noteData)
            onUpdate()
        } catch (err) {
            console.log("Error updating note: ", err);
        }
    }

    const handleClose = () => {
        setNoteData({} as NoteType)
        closeEdit()
    }

    return (
        <div className="w-80 bg-[#232329] p-5 rounded-2xl ml-5 relative">
            <X onClick={handleClose} className="absolute top-5 right-5 cursor-pointer" />
            <div>Note</div>
            {noteData && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <label>
                        Heading: 
                        <input
                            type="text"
                            size={10}
                            value={noteData.MainNoteText}
                            onChange={handleTextChange}
                            className="bg-secondary rounded-lg px-2 py-1 ml-2" />
                    </label>

                    {noteData && noteData.sub_notes && noteData.sub_notes.map((sbnote, index) => (
                        <div key={sbnote._id}>
                            <input
                                type="text"
                                size={10}
                                value={sbnote.text}
                                onChange={(e) => handleSubTextChange(e, sbnote._id)}
                                className={`${colors[index%colors.length]} rounded-lg px-2 py-1`} />
                        </div>
                    ))}
                    <button type="submit" className="p-2 border rounded-lg bg-secondary">Save</button>
                </form>
            )}
        </div>
    )
}
