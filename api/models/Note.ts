import mongoose from "mongoose";

const subNoteSchema = new mongoose.Schema({
    text: { type: String, required: true }
})

const noteSchema = new mongoose.Schema({
    text: { type: String, required: true },
    order: { type: Number, required: true },
    sub_notes: { type: [subNoteSchema], default: [] }
});

const NoteModel = mongoose.model("Notes", noteSchema);
export default NoteModel;
