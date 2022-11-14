import express, { Application, Request, Response } from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import Routes from "./routes";
import Connect from "./db/connect";

const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res.send("TS App is Running");
});

const PORT = process.env.PORT || 3000;
const db = process.env.MONGO_URI || "mongodb://mongo:27017/test";

Connect({ db });
Routes({ app });

app.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT}`);
});
