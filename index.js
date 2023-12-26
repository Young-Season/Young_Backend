import app from "./config/express.js";
import { logger } from "./config/winston.js";
import connectDB from "./config/database.js";

const port = 3000;
app.listen(port);
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);
connectDB();
