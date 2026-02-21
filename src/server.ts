import "dotenv/config";
import express from "express";
import config from "./config/index";
import connectToMongoDB from "./config/mongodb";
import logger from "./config/winston";
import loggerMiddleware from "./middlewares/logger.middleware";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

const app = express();

// Middlewares
app.use(loggerMiddleware);
app.use(
  cors({
    origin: [...(config.ALLOWED_ORIGINS || "*")],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(
  helmet({
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

// Routes
app.get("/", (_, res) => {
  res.status(200).json({ message: "Hello, World!" });
});

app.get("/health", (_, res) => {
  res.status(200).json({ message: "Everything is fine" });
});

// Error Handler
app.use(errorHandler);

connectToMongoDB()
  .then(() => {
    app.listen(config.PORT, () => {
      logger.info(`Server is running on port ${config.PORT}`);
    });
  })
  .catch((error) => {
    logger.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });
