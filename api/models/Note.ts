import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    MainNoteText: { type: String, required: true },
    order: { type: Number, required: true },
    sub_notes: [{
        _id: { type: String, required: true },
        text: { type: String, required: true }
    }]
});

const NoteModel = mongoose.model("Notes", noteSchema);
export default NoteModel;
