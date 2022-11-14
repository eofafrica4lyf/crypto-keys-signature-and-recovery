import mongoose, { Schema, Document } from "mongoose";

export interface IKeys extends Document {
    private: String;
    public: String;
    privateHex: String;
}

export interface IKeyPairs {
    private?: String;
    public?: String;
}

export interface IEncryptedPrivateKey {
    nonce: String;
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
