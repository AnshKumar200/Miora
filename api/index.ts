import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Note from "./models/Note";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const PORT = process.env.PORT || 7878;
const DB_URL = process.env.DATABASE_URL || "";

mongoose.connect(DB_URL)
    .then(() => console.log("Connected to the databse"))
    .catch(err => console.error("Error connecting to the database: ", err));

app.get("/get_notes", async (_, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(500).json("unexpected error");
        }
    }
});

app.post("/sync_notes", async (req, res) => {
    try {
        const notes = req.body;
        const ops = notes.map((note: any) => {
            if(mongoose.Types.ObjectId.isValid(note._id)) {
                return {
                    updateOne: {
                        filter: { _id: note._id },
                        update: { $set: { order: note.order } }
                    }
                };
            } else {
                const { _id, ...noteData } = note;
                return {
                    insertOne: {
                        document: noteData
                    }
                };
            }
        })
        await Note.bulkWrite(ops);
        res.json({ success: true });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(500).json("unexpected error");
        }
    }
});

app.get("/find_note", async (req, res) => {
    try {
        const { id } = req.query;
        const note = await Note.find({ _id: id }, {});
        res.status(200).json(note);
    } catch (err: unknown) {
        if(err instanceof Error) {
            res.status(500).json({ error: err.message })
        }
        else {
            res.status(500).json("unexpected error")
        }
    }
})

app.post("/update_note", async (req, res) => {
    try {
        const { _id, ...noteData } = req.body;
        await Note.updateOne( { _id: req.body._id }, { $set : noteData })  
        res.json({ success: true })
    } catch (err) {
        if(err instanceof Error) {
            res.status(500).json({ error: err.message })
        }
        else {
            res.status(500).json("unexpected error")
        }
    }
})

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})
