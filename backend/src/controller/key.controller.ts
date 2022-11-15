import { Request, Response } from "express";
import { IKeyPair, IKeys } from "../models/keys.model";
import KeysService from "../services/key.service";

const generateKeys = async (req: Request, res: Response) => {
  const keys = await KeysService.generateKeys();

  const encryptedKeys = await KeysService.encryptKeys(keys, req.body.pinCode)

  await KeysService.clearKeys();

  const savedKeys = await KeysService.saveGeneratedKeys(keys, encryptedKeys);

  return res.status(200).json({
    success: true,
    data: { pinCode: req.body.pinCode, keys: JSON.parse(JSON.stringify(savedKeys.map(key => key.public))) },
    message: null
  });
};

const signMessage = async (req: Request, res: Response) => {
  const keys:IKeys[] = await KeysService.getKeys();
  
  const decryptedKeys: IKeyPair[] = await KeysService.decryptPrivateKeys(keys, req.body.pinCode);

  const currentPrivateKey:IKeyPair[] = decryptedKeys.filter((key: IKeyPair) => key.public === req.body.publicKey)

  if(!currentPrivateKey || currentPrivateKey.length === 0) return res.status(404).json({
    success: false,
    data: null,
    message: "Private key not found"
  })

  const signedMessage = await KeysService.signMessage(currentPrivateKey[0].private as string, req.body.pinCode);

  await KeysService.encryptKeys(keys, req.body.pinCode);

  return res.status(200).json({
    success: true,
    data: { signature: signedMessage },
    message: null
  })
}

export default {
  generateKeys,
  signMessage
};
