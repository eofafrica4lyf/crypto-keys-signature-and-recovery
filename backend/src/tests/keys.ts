import { expect } from "chai";
import { IKeyPair } from "../models/keys.model";
import KeyService from "../services/key.service";

describe("Key Service", () => {
    let generatedPrivateKeys: string[];
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
            const generatedKeyPairs = await KeyService.generateKeys();
            generatedPrivateKeys = generatedKeyPairs.map((key: IKeyPair) => key.private) as string[];
        })
        it("It should sucessfully encrypt a set of private keys", async () => {
            const encryptedPrivateKeys = await KeyService.encryptKeys(generatedPrivateKeys, 'pin')
            expect(encryptedPrivateKeys).to.be.an("array");
            expect(encryptedPrivateKeys).to.have.lengthOf(5);
            encryptedPrivateKeys.forEach((key) => {
                expect(key).to.be.a("string");
            })
        });
    });
});
