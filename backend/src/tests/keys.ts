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
});
