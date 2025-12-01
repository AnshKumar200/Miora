import './App.css'
import Note from './components/Note'

const note_data = [
    {
        id: "1",
        text: "this is a test note",
        sub_notes: [
            {
                id: "3",
                text: "this is a sub note",
            },
            {
                id: "4",
                text: "also a sub note",
            }
        ]
    },
    {
        id: "2",
        text: "this is also a test note",
        sub_notes: [
        ]
    },
]

function App() {
    return (
        <div className=''>
            <button>Add note</button>

            <div className='flex gap-10'>
                {note_data.map(note => (
                    <Note key={note.id} note={note} />
                ))}
            </div>
        </div>
    )
}

export default App
