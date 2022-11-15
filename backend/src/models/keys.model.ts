import mongoose, { Schema, Document } from "mongoose";

export interface IKeys extends Document {
    privateHex: string;
}

export interface IKeyPair {
    private?: string;
    public?: string;
}

const KeySchema: Schema = new Schema({
    privateHex: {
        type: String,
        required: true,
        unique: true,
    }
});

export default mongoose.model<IKeys>("Keys", KeySchema);
