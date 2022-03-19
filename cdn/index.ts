import "dotenv/config";
import express from "express";
import path from "path";
const app = express();

app.use("/", express.static(path.join(__dirname, "images")));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
