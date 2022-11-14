import { Request, Response } from "express";
import KeysService from "../services/key.service";

const generateKeys = async (req: Request, res: Response) => {
  const keys = await KeysService.generateKeys();

  const encryptedKeys = await KeysService.encryptKeys(keys, req.body.message)

  await KeysService.clearKeys();

  const savedKeys = await KeysService.saveGeneratedKeys(keys, encryptedKeys);

  return res.status(200).json({ message: req.body.message, keys: JSON.parse(JSON.stringify(savedKeys.map(key => key.public))) });
};

export default {
  generateKeys,
};
