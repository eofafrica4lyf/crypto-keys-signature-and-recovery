import keysModel, { IKeyPairs, IKeys } from "../models/keys.model";
import { PrivateKey } from "eosjs-ecc";
import aesjs from 'aes-js';
import crypto from "crypto";

async function generateKeys(): Promise<IKeyPairs[]> {
    let generatedKeys: IKeyPairs[] = []
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

async function encryptKeys(keys: IKeyPairs[], pin: string): Promise<IKeyPairs["private"][]> {
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

const decoder = new TextDecoder('UTF-8');

const toString = (bytes: any) => {
    const array = new Uint8Array(bytes);
    return decoder.decode(array);
};

const toBytes = (str: string)=> {
	const buffer: Buffer = Buffer.from(str, 'utf8');
	const result = Array(buffer.length);
	for (var i = 0; i < buffer.length; i++) {
		result[i] = buffer[i];
	}
	return result;
};
// const bytes = toBytes('Some text here...');
// console.log(bytes);

async function clearKeys (): Promise<void> {
    await keysModel.deleteMany();
    return;
}

async function saveGeneratedKeys(keys: IKeyPairs[], encryptedKeys: IKeyPairs["private"][]): Promise<IKeys[]> {
    const data = keys.map((key: IKeyPairs, index: number) => ({ ...key, privateHex: encryptedKeys[index]}))
    const savedData: IKeys[] = await keysModel.insertMany(data)
    return savedData;
}

export default {
    generateKeys,
    encryptKeys,
    clearKeys,
    saveGeneratedKeys
}