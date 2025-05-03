import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import userRoute from "./routes/userRoute";
import blogRoute from "./routes/blogsRoute";
import mongoose from "mongoose";
import { exit } from "node:process";

dotenv.config();

const app = express();
const HOSTNAME = "localhost";
const PORT = process.env.PORT || 5000;

const connect = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/blog-app-api";
        console.log("Connecting to db ...");
        await mongoose.connect(MONGO_URI, {
            dbName: "blog-app-api",
        });

        console.log("Connected to the DB!");
    } catch(err) {
        console.log("Error connecting to the db.", err);
        exit(1);
    }
};

// connect to the db
const connectToDb = async () => {
    await connect();
};

connectToDb();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/users", userRoute);
app.use("/api/blogs", blogRoute);

app.listen(PORT, () => {
    console.log(`Server listening on: ${HOSTNAME}:${PORT}`);
});
