import { Request, Response } from "express";
import { IKeyPair, IKeys } from "../models/keys.model";
import KeysService from "../services/key.service";

const generateKeys = async (req: Request, res: Response): Promise<Response> => {
  try {
    const generatedKeyPairs = await KeysService.generateKeys();

    const privateKeys = generatedKeyPairs.map((key: IKeyPair) => key.private) as string[];
    const encryptedKeys = await KeysService.encryptKeys(privateKeys, req.body.pinCode)

    await KeysService.clearKeys();

    await KeysService.saveGeneratedKeys(encryptedKeys);

    return res.status(200).json({
      success: true,
      data: { pinCode: req.body.pinCode, keys: JSON.parse(JSON.stringify(generatedKeyPairs.map(key => key.public))) },
      message: null
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

const signMessage = async (req: Request, res: Response): Promise<Response> => {
  try {
    const keys:IKeys[] = await KeysService.getKeys();
    
    const decryptedKeys: IKeyPair[] = await KeysService.decryptPrivateKeys(keys, req.body.pinCode);
    if(!decryptedKeys || decryptedKeys.length === 0) return res.status(404).json({
      success: false,
      data: null,
      message: "Wrong Pin Code"
    })

    const currentPrivateKey:IKeyPair[] = decryptedKeys.filter((key: IKeyPair) => key.public === req.body.publicKey)

    if(!currentPrivateKey || currentPrivateKey.length === 0) return res.status(404).json({
      success: false,
      data: null,
      message: "Private key not found"
    })

    const signedMessage = await KeysService.signMessage(currentPrivateKey[0].private as string, req.body.message);

    const privateKeys = decryptedKeys.map((key: IKeyPair) => key.private) as string[]
    await KeysService.encryptKeys(privateKeys, req.body.pinCode);

    return res.status(200).json({
      success: true,
      data: { signature: signedMessage },
      message: null
    })
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      data: null,
      message: error.message
    });
  }
}

async function recoverPublicKey(req: Request, res: Response): Promise<Response> {
  const {message, signature} = req.body;
  const publicKey = await KeysService.recoverPublicKey(message, signature)
  return res.status(200).json({
    success: true,
    data: { publicKey },
    message: null
  })
}

export default {
  generateKeys,
  signMessage,
  recoverPublicKey
};
