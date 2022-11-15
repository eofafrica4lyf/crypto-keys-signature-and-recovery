import keysModel, { IKeyPair, IKeys } from "../models/keys.model";
import ecc, { PrivateKey } from "eosjs-ecc";
import aesjs from 'aes-js';

async function generateKeys(): Promise<IKeyPair[]> {
    let generatedKeys: IKeyPair[] = []
    const privateKeysPromises: Promise<string>[] = [];
    let publicKeysPromises: Promise<string>[] = [];
    let publicKeys: string[] = [];
    
    //generate private keys
    for(let i = 0; i < 5; i++ ) {
        privateKeysPromises.push(PrivateKey.randomKey());
    }
    let privateKeysRaw = await Promise.all(privateKeysPromises);


    let privateKeys = privateKeysRaw.map((privateKey: any) => {
        privateKey = privateKey.toString();
        generatedKeys.push({ private: privateKey })
        return privateKey
    });

    //generate public keys
    publicKeysPromises = privateKeys.map(privateKey => PrivateKey.fromString(privateKey).toPublic().toString());
    publicKeys = await Promise.all(publicKeysPromises);
    publicKeys.map((publicKey, index) => generatedKeys[index].public = publicKey)

    return generatedKeys;
}

async function encryptKeys(keys: IKeyPair[], pin: string): Promise<IKeyPair["private"][]> {
    const encryptedKeysPromises = [];

    // const keyz = crypto.pbkdf2Sync('secret', 'salt', 100000, 32, 'sha256');
    let keyBytes = new Uint32Array(Buffer.from(pin));
    let aesCtr = new aesjs.ModeOfOperation.ctr(keyBytes, new aesjs.Counter(5));

    for(let i = 0; i < keys.length; i++) {
        let textBytes = aesjs.utils.utf8.toBytes(keys[i].private as string);
        encryptedKeysPromises.push(aesCtr.encrypt(textBytes));
    }

    const encryptedKeys: Uint8Array[] = await Promise.all(encryptedKeysPromises)

    const keysToHexPromises = [];
    for(let i = 0; i < keys.length; i++) {
        const a = aesjs.utils.hex.fromBytes(encryptedKeys[i]);
        keysToHexPromises.push(a.toString())
    }

    const keysToHex = await Promise.all(keysToHexPromises); 

    return keysToHex;
}

async function clearKeys (): Promise<void> {
    await keysModel.deleteMany();
    return;
}

async function saveGeneratedKeys(keys: IKeyPair[], encryptedKeys: IKeyPair["private"][]): Promise<IKeys[]> {
    const data = keys.map((key: IKeyPair, index: number) => ({ ...key, privateHex: encryptedKeys[index]}))
    const savedData: IKeys[] = await keysModel.insertMany(data)
    return savedData;
}

async function getKeys(): Promise<IKeys[]> {
    return await keysModel.find() as IKeys[];
}

async function decryptPrivateKeys(keys: IKeys[], pin: string): Promise<IKeyPair[]>{
    let decryptedKeys: IKeyPair[] = [];
    let keyBytes = new Uint32Array(Buffer.from(pin));
    let aesCtr = new aesjs.ModeOfOperation.ctr(keyBytes, new aesjs.Counter(5));

    for(let i = 0; i < keys.length; i++) {
        var encryptedBytes = aesjs.utils.hex.toBytes(keys[i].privateHex);
        let decryptedMessage = await aesCtr.decrypt(encryptedBytes);
        let decryptedText = aesjs.utils.utf8.fromBytes(decryptedMessage);
        let regeneratedPublicKey = PrivateKey.fromString(decryptedText).toPublic().toString() 
        decryptedKeys.push({private: decryptedText, public: regeneratedPublicKey});
    }

    return decryptedKeys;
}

async function signMessage(privateKey: string, message: string): Promise<string> {
    return await ecc.sign(message, PrivateKey.fromString(privateKey));
}

async function recoverPublicKey(message: string, signature: string): Promise<string> {
    return await ecc.recover(signature, message);
}

export default {
    generateKeys,
    encryptKeys,
    clearKeys,
    saveGeneratedKeys,
    getKeys,
    decryptPrivateKeys,
    signMessage,
    recoverPublicKey
}