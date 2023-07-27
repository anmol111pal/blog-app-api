import express, { urlencoded } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import userRoute from "./routes/userRoute.js";
import blogRoute from "./routes/blogsRoute.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const HOSTNAME = process.env.HOSTNAME || "localhost";
const PORT = process.env.PORT || 5000;

const connect = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || "localhost:27017/blog-app";
        console.log("Connecting to db ...");
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("Connected to the DB!");
    } catch(err) {
        console.log("Error connecting to the db.");
    }
}

// connect to the db
connect();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/users", userRoute);
app.use("/api/blogs", blogRoute);

app.listen(PORT, () => {
    console.log(`Server listening on: ${HOSTNAME}:${PORT}`);
});
