import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import routes from "./src/routes";
import mongoose from "mongoose";
const app = express();

const mongoUrl = `${process.env.MONGODB_URL}/${process.env.DB_NAME}`
mongoose.connect(mongoUrl).catch();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET"],
    credentials: true,
}));

app.use("/api", routes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
