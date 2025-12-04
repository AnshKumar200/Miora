import { X } from "lucide-react";
import { useState, type FormEvent } from "react"

interface AddNoteProps {
    onNoteAdd: (note: { text: string }) => void,
    closeAdd: () => void,
}

export default function AddNote({ onNoteAdd, closeAdd }: AddNoteProps) {
    const [text, setText] = useState<string>('');

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        onNoteAdd({ text });
        setText('');
    }
    
    const handleClose = () => {
        setText('')
        closeAdd()
    }
    
    return (
        <div className="w-80 bg-[#232329] p-5 rounded-2xl ml-5 relative">
            <X onClick={handleClose} className="absolute top-5 right-5 cursor-pointer"/>
            <div>Add a new Note</div>
            <form className="mt-5 flex flex-col gap-5" onSubmit={handleSubmit}>
                <label>
                    Text:
                    <input type="text" size={10} value={text} onChange={(e) => setText(e.target.value)} className="bg-secondary ml-3 rounded-lg" />
                </label>
                <button type="submit" className="p-2 border rounded-lg bg-secondary">Add Note</button>
            </form>
        </div>
    )
}
