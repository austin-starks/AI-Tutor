import cookieParser from "cookie-parser";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import rateSlow from "express-slow-down";
import helmet from "helmet";
import logger from "morgan";
import path from "path";
import questionRouter from "./routes/question";
import paymentRouter from "./routes/payment";
import userRouter from "./routes/user";
import Db from "./services/db";
const DOES_RATE_LIMITING = true;

const limiterStop = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 300, // limit each IP to 100 requests per windowMs,
  headers: false, // put true if you want client to know their rate is limited,
  message: "Server Error. Please try again later.",
});

const limiterSlow = rateSlow({
  windowMs: 1 * 60 * 1000, // 1 minute
  delayAfter: 120, // allow 5 requests to go at full-speed, then...
  delayMs: 100, // 6th request has a 100ms delay, 7th has a 200ms delay, 8th gets 300ms, etc.
});

const app = express();
const db = new Db(process.env.DB_ENV as any);
db.connect();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
if (DOES_RATE_LIMITING) {
  app.use(limiterStop);
  app.use(limiterSlow);
}
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
app.set("trust proxy", 1);

app.use("/api/question", questionRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/user", userRouter);

if (process.env.NODE_ENV === "production") {
  let url = path.join(__dirname, "../../client/build");
  app.use(express.static(url));

  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
  });
}

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server is starting at PORT ${PORT}`);
});
