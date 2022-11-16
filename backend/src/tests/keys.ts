import { expect } from "chai";
import { IKeyPair, IKeys } from "../models/keys.model";
import KeyService from "../services/key.service";
import ecc, { PrivateKey } from "eosjs-ecc";
import aesjs from 'aes-js';
import crypto from 'crypto';

describe("Key Service", () => {
    let generatedKeyPairs: IKeyPair[];
    let generatedPrivateKeys: string[];
    let encryptedPrivateKeys: IKeys[];
    let signature: string;
    describe("Key Generation", () => {
        it("should successfully generate 5 pairs of private and public keys", async () => {
            const generatedKeyPairs: IKeyPair[] = await KeyService.generateKeys();
            expect(generatedKeyPairs).to.be.an("array");
            expect(generatedKeyPairs).to.have.lengthOf(5);
            generatedKeyPairs.forEach((key) => {
                expect(key).to.have.property("private");
                expect(key).to.have.property("public");
            })
        });
    });
    
    describe("Key Encryption", () => {
        beforeEach(async() => {
            generatedKeyPairs = await KeyService.generateKeys();
            generatedPrivateKeys = generatedKeyPairs.map((key: IKeyPair) => key.private) as string[];
        })
        it("should sucessfully encrypt a set of private keys", async () => {
            const encryptedPrivateKeys: string[] = await KeyService.encryptKeys(generatedPrivateKeys, 'pin');
            expect(encryptedPrivateKeys).to.be.an("array");
            expect(encryptedPrivateKeys).to.have.lengthOf(5);

            let keyBytes = crypto.pbkdf2Sync('pin', 'salt', 100000, 32, 'sha256');
            let aesCtr = new aesjs.ModeOfOperation.ctr(keyBytes, new aesjs.Counter(5));

            encryptedPrivateKeys.forEach( async (key, index) => {
                let encryptedBytes = aesjs.utils.hex.toBytes(key);
                let decryptedMessage = await aesCtr.decrypt(encryptedBytes);
                let decryptedText = aesjs.utils.utf8.fromBytes(decryptedMessage);
                expect(decryptedText).to.be.equal(generatedPrivateKeys[index]);
            })
        });
    });
    
    describe("Key Decryption", () => {
        beforeEach(async() => {
            generatedKeyPairs = await KeyService.generateKeys();
            generatedPrivateKeys = generatedKeyPairs.map((key: IKeyPair) => key.private) as string[];
            const keys = await KeyService.encryptKeys(generatedPrivateKeys, 'pin')
            encryptedPrivateKeys = keys.map(key => ({privateHex: key})) as IKeys[];
        })
        it("should sucessfully decrypt and return a set of private keys", async () => {
            const decryptedPrivateKeys = await KeyService.decryptPrivateKeys(encryptedPrivateKeys, 'pin')
            expect(decryptedPrivateKeys).to.be.an("array");
            expect(decryptedPrivateKeys).to.have.lengthOf(5);
            decryptedPrivateKeys.forEach((key, index) => {
                expect(key).to.have.property("private");
                expect(decryptedPrivateKeys[index].private).to.equal(generatedPrivateKeys[index]);
                expect(key).to.have.property("public");
            })
        });
        it("should fail to decrypt private keys a an empty set when a wrong pin is provided", async () => {
            const decryptedPrivateKeys = await KeyService.decryptPrivateKeys(encryptedPrivateKeys, 'wrong pin')
            expect(decryptedPrivateKeys).to.be.an("array");
            expect(decryptedPrivateKeys).to.have.lengthOf(0);
        });
    });
    
    describe("Message Signing", () => {
        beforeEach(async() => {
            generatedKeyPairs = await KeyService.generateKeys();
        })
        it("should sucessfully sign a message", async () => {
            const signature = await KeyService.signMessage(generatedKeyPairs[0].private as string, 'message');

            const recoveredPublicKey = await ecc.recover(signature, "message");
            expect(generatedKeyPairs[0].public).to.be.equal(recoveredPublicKey);
        });
    });
    
    describe("Message Recovery", () => {
        beforeEach(async() => {
            generatedKeyPairs = await KeyService.generateKeys();
            signature = await KeyService.signMessage(generatedKeyPairs[0].private as string, 'message');
        })
        it("should sucessfully receover a public key from a signature", async () => {
            const recoveredPublicKey = await KeyService.recoverPublicKey('message', signature);

            expect(recoveredPublicKey).to.be.equal(generatedKeyPairs[0].public);
        });
    });
});
