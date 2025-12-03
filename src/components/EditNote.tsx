import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import type { Note as NoteType } from "../types/types";
import axios from "axios";

interface EditNoteProps {
    NoteId: string,
    onUpdate: () => void;
}

export default function EditNote({ NoteId, onUpdate }: EditNoteProps) {
    const [noteData, setNoteData] = useState<NoteType>();

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
            }
            )
            setNoteData(resp.data[0]);
        } catch (err) {
            console.log("Error getting note data: ", err)
        }
    }

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!noteData) return;
        setNoteData({ ...noteData, text: e.target.value })
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
            onUpdate();
        } catch (err) {
            console.log("Error updating note: ", err);
        }
    }

    return (
        <div className="w-80 bg-[#232329] p-5 rounded-2xl ml-5">
            <div>Edit Note</div>
            {noteData && (
                <form onSubmit={handleSubmit}>
                    <label>
                        Text:
                        <input
                            type="text"
                            size={10}
                            value={noteData.text}
                            onChange={handleTextChange}
                            className="bg-secondary ml-3 rounded-lg px-2 py-1" />
                    </label>

                    <div className="flex flex-col gap-5 mt-5">
                        {noteData.sub_notes.map(sbnote => (
                            <label key={sbnote._id}>
                                Text:
                                <input
                                    type="text"
                                    size={10} 
                                    value={sbnote.text} 
                                    onChange={(e) => handleSubTextChange(e, sbnote._id)}
                                    className="bg-secondary ml-3 rounded-lg px-2 py-1" />
                            </label>
                        ))}
                    </div>
                    <button type="submit" className="p-2 border rounded-lg bg-secondary">Save</button>
                </form>
            )}
        </div>
    )
}
