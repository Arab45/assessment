import express from "express";
import cors from "cors";
import creatorCardRoutes from "./src/routes/creatorCard.routes.js";
import errorHandler from "./src/middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/", creatorCardRoutes);

app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "OK", message: "Creator Card API is running" });
});

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

export default app;
