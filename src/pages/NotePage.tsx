import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import type { Note as NoteType } from "../types/types";
import axios from "axios";

export default function NotePage() {
    const colors = ["bg-red-500", "bg-pink-500", "bg-purple-500", "bg-indigo-500", "bg-blue-500", "bg-cyan-500", "bg-teal-500", "bg-green-500", "bg-lime-500", "bg-yellow-500", "bg-amber-500", "bg-orange-500", "bg-gray-500", "bg-white"];
    const { id } = useParams();
    const [noteData, setNoteData] = useState<NoteType>();

    useEffect(() => {
        getNoteData()
    }, [])

    const getNoteData = async () => {
        try {
            const resp = await axios.get("http://localhost:7878/find_note", {
                params: {
                    id
                }
            })
            setNoteData(resp.data[0])
        } catch (err) {
            console.error("Error getting note data: ", err)
        }
    }

    return (
        <div className="flex flex-col items-center">
            <div className="text-2xl">{noteData?.MainNoteText}</div>
            <div className="flex gap-20">
                <div>
                    {noteData?.sub_notes.map((sbnote, index) => (
                        <div key={sbnote._id} className={`${colors[index%colors.length]} w-50 text-ellipsis overflow-hidden`}>{sbnote.text}</div>
                    ))}
                </div>
                <div>
                    {noteData?.sub_notes.map(sbnote => (
                        <div>{sbnote.text}</div>
                    ))}
                </div>
            </div>
        </div>
    )
}
