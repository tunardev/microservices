import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import routes from "./src/routes";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use("/api", routes);

app.listen(process.env.PORT as string, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
