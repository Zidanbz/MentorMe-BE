const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
// const http = require("http");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const registerRouter = require("./routes/RegistrationUserRouter");
const loginUserRouter = require("./routes/LoginUserRouter");
const projectRouter = require("./routes/ProjectRouter");
const categoryRouter = require("./routes/CategoryRouter");
const learningPathRouter = require("./routes/LearningPathRouter");
const voucherRouter = require("./routes/VoucherRouter");
const syllabusRouter = require("./routes/SyllabusRouter");
const reviewRouter = require("./routes/ReviewRouter");
const transactionRouter = require("./routes/TransactionRouter");
const learningRouter = require("./routes/LearningRouter");
const activityRouter = require("./routes/ActivityRouter");
// const {initializeSocket} = require("./public/javascripts/config/SocketConfig");
const topupRouter = require("./routes/TopUpRoutes");
const consultationRouter = require("./routes/ConsultationRoutes");
const notifRouter = require("./routes/NotifRouter");
const chat = require("./routes/ChatRouter");
const cors = require('cors');
const app = express();

// Menggunakan middleware cors untuk menonaktifkan CORS
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({
  extended: false, // Add a trailing comma here
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/", usersRouter);
app.use("/", registerRouter);
app.use("/", loginUserRouter);
app.use("/", projectRouter);
app.use("/", categoryRouter);
app.use("/", learningPathRouter);
app.use("/", voucherRouter);
app.use("/", syllabusRouter);
app.use("/", reviewRouter);
app.use("/", transactionRouter);
app.use("/", learningRouter);
app.use("/", activityRouter);
app.use("/", topupRouter);
app.use("/", consultationRouter);
app.use("/", notifRouter);
app.use("/", chat);
// Membuat server HTTP manual
// const server = http.createServer(app);
//
// const initializeApp = server => {
// initializeSocket(server);
// }

// initializeSocket(server);

// catch 404 and forward to error handler
app.use((req, res, next) => { // Prefer arrow function here
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => { // Prefer arrow function here
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});


// jika deploy gunakan ini
module.exports = app;
// module.exports = server;

// percobaan
// module.exports = {
//   initializeApp,
//   app,
// }

