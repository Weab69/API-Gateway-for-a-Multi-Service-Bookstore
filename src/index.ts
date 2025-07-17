import express, { Express, Request, Response } from "express";
import dotenv from "dotenv"
import logger from "./utils/logger";
import { setupSwagger } from "./docs/swagger";

dotenv.config();

const port = process.env.PORT || 8000;

const app: Express = express();

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next()
})

setupSwagger(app);

/**
 * @openapi
 * /:
 *   get:
 *     summary: Root endpoint
 *     description: Returns a simple greeting message.
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Hello from express + TS
 */
app.get("/", (req: Request, res: Response) => {
    res.send("Hello from express + TS");
});

/**
 * @openapi
 * /hi:
 *   get:
 *     summary: Hi endpoint
 *     description: Returns a farewell message.
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: byeeee
 */
app.get("/hi", (req: Request, res: Response) => {
    res.send("byeeee");
});


app.listen(port, ()=> {
    console.log(`now listining on port ${port}`);
})