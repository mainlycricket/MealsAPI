require("dotenv").config();
require("express-async-errors");

// express

const express = require("express");
const app = express();

// other packages

// const morgan = require('morgan');
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

// database

const connectDB = require("./db/connect");

// routers
const authRoutes = require("./routes/authRoutes");
const mealRoutes = require("./routes/mealRoutes");

// middlewares

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // ms
    max: 60,
  })
);

app.use(helmet());
app.use(xss());
app.use(cors());
app.use(mongoSanitize());

app.use(morgan("tiny"));
app.use(express.json()); // access data of req.body
app.use(cookieParser(process.env.JWT_SECRET));

// routes

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/meals", mealRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, console.log(`app is listening at ${PORT}`));
  } catch (error) {
    console.log("connection failed");
  }
};

start();
