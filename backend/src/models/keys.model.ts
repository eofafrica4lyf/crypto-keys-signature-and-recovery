import mongoose, { Schema, Document } from "mongoose";

export interface IKeys extends Document {
    private: string;
    public: string;
    privateHex: string;
}

export interface IKeyPair {
    private?: string;
    public?: string;
}

export interface IEncryptedPrivateKey {
    nonce: string;
    message: Buffer;
    checksum: Number;
}

const KeySchema: Schema = new Schema({
    private: {
        type: String,
        required: true,
        unique: true,
    },
    public: {
        type: String,
        required: true,
        unique: true,
    },
    privateHex: {
        type: String,
        required: true,
    }
});

export default mongoose.model<IKeys>("Keys", KeySchema);
