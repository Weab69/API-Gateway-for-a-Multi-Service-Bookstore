import express, { Express, Request, Response } from "express";
import dotenv from "dotenv"
import logger from "./utils/logger";

dotenv.config();

const port = process.env.PORT || 8000;

const app: Express = express();

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next()
})

app.get("/", (req: Request,res: Response) => {
    res.send("Hello from express + TS")
})

app.get("/hi", (req: Request,res: Response) => {
    res.send("byeeee")
})

app.listen(port, ()=> {
    console.log(`now listining on port ${port}`);
})