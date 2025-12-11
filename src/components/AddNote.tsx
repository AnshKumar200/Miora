import { X } from "lucide-react";
import { useState, type FormEvent } from "react"
import type { Note as NoteType } from "../types/types";
import type { SubNote as SubNoteType } from "../types/types";
import { v4 as uuidv4 } from "uuid";

interface AddNoteProps {
    onNoteAdd: (newNoteData: NoteType) => void,
    closeAdd: () => void,
}

export default function AddNote({ onNoteAdd, closeAdd }: AddNoteProps) {
    const [mainNoteText, setMainNoteText] = useState<string>('');
    const [subNotes, setSubNotes] = useState<SubNoteType[]>([]);
    const [subNoteText, setSubNoteText] = useState('');

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const tempNote: NoteType = {
            _id: '',
            order: 0,
            MainNoteText: mainNoteText,
            sub_notes: subNotes
        }
        onNoteAdd(tempNote);
        setMainNoteText('');
        setSubNotes([]);
        setSubNoteText('');
    }

    const handleClose = () => {
        setMainNoteText('')
        closeAdd()
    }

    const handleAddSubNote = () => {
        const tempSubNote: SubNoteType = {
            _id: uuidv4(),
            text: subNoteText
        };
        setSubNotes(prev => [...prev, tempSubNote])
        setSubNoteText('')
    }

    return (
        <div className="w-80 bg-[#232329] p-5 rounded-2xl ml-5 relative">
            <X onClick={handleClose} className="absolute top-5 right-5 cursor-pointer" />
            <div>Add a new Note</div>
            <form className="mt-5 flex flex-col gap-5" onSubmit={handleSubmit}>
                <label>
                    Main Note Text:
                    <input type="text" size={10} value={mainNoteText} onChange={(e) => setMainNoteText(e.target.value)} className="bg-secondary ml-3 rounded-lg" />
                </label>
                <label>
                    Sub Note Text:
                    <input type="text" size={10} value={subNoteText} onChange={(e) => setSubNoteText(e.target.value)} className="bg-secondary ml-3 rounded-lg" />
                </label>
                <button type="button" onClick={handleAddSubNote} className="cursor-pointer">Add SubNote</button>
                {subNotes.map(sbnote => (
                    <div key={sbnote._id}>
                        <div>{sbnote._id}</div>
                        <div>{sbnote.text}</div>
                    </div>
                ))}
                <button type="submit" className="p-2 border rounded-lg bg-secondary cursor-pointer">Add Note</button>
            </form>
        </div>
    )
}
