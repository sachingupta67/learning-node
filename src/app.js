require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const { connectDB } = require("../src/config/database");
const cookieParser = require("cookie-parser");
// require("./utils/cron-jobs/email-cron"); | Cron JOB Code - Uncomment when you want to run this

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");




app.use(
  cors({
    origin:"http://localhost:5173",
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
    app.listen(process.env.PORT, () => {
      console.log(`Server Running at Port : ${process.env.PORT}......`);
    });
  })
  .catch((err) => {
    console.log("err:::", JSON.parse(err));
  });
