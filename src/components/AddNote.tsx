import { useState, type FormEvent } from "react"

interface AddNoteProps {
    onNoteAdd: (note: { text: string }) => void;
}

export default function AddNote({ onNoteAdd }: AddNoteProps) {
    const [text, setText] = useState<string>('');

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        onNoteAdd({ text });
        setText('');
}

return (
    <div className="w-80 bg-[#232329] p-5 rounded-2xl ml-5">
        <div>Add a new Note</div>
        <form className="mt-5 flex flex-col gap-2" onSubmit={handleSubmit}>
            <label>
                Text:
                <input type="text" size={10} value={text} onChange={(e) => setText(e.target.value)} className="bg-secondary ml-3 rounded-lg" />
            </label>
            <button type="submit">Add Note</button>
        </form>
    </div>
)
}
