const express = require("express");
const app = express();
const cors = require("cors");
const { connectDB } = require("../src/config/database");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://16.16.183.51",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

app.use("/", (err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

connectDB()
  .then(() => {
    console.log("res::: DB Success");
    app.listen(8080, () => {
      console.log("Server Running at Port : 8080......");
    });
  })
  .catch((err) => {
    console.log("err:::", JSON.parse(err));
  });
