import { RoutesInput } from "../types/route";
import KeysController from "../controller/key.controller";

export default ({ app }: RoutesInput) => {
    app.post("/generate-keys", KeysController.generateKeys);
    app.post("/sign-message", KeysController.signMessage);
    app.post("/recover-publickey", KeysController.recoverPublicKey);
};
