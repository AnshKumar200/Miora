type SubNote = {
    id: string,
    text: string
}

interface NoteItem {
    note: {
        id: string,
        text: string,
        sub_notes: SubNote[],
    }
}

const Note: React.FC<NoteItem> = ({ note }) => {
    return (
        <div className="bg-amber-400 p-2">
            <div>Parent: {note.id}</div>
            <div>{note.text}</div>

            <div>
                {note.sub_notes.map(sub_note => (
                    <div className="border black p-2 m-2">
                        <div>{sub_note.id}</div>
                        <div>{sub_note.text}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Note;
