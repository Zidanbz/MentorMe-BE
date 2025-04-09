// const createError = require('http-errors');
// const express = require('express');
// const path = require('path');
// const cookieParser = require('cookie-parser');
// const logger = require('morgan');
// // const { onRequest } = require('firebase-functions/v2/https');
//
// const indexRouter = require('../routes');
// const usersRouter = require('../routes/users');
// const registerRouter = require('../routes/RegistrationUserRouter');
// const loginUserRouter = require('../routes/LoginUserRouter');
// const projectRouter = require('../routes/ProjectRouter');
// const categoryRouter = require('../routes/CategoryRouter');
// const learningPathRouter = require('../routes/LearningPathRouter');
// const voucherRouter = require('../routes/VoucherRouter');
// const syllabusRouter = require('../routes/SyllabusRouter');
// const reviewRouter = require('../routes/ReviewRouter');
// const transactionRouter = require('../routes/TransactionRouter');
// const learningRouter = require('../routes/LearningRouter');
// const activityRouter = require('../routes/ActivityRouter');
//
// const app = express();
//
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
//
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
// app.use('/', indexRouter);
// app.use('/', usersRouter);
// app.use('/', registerRouter);
// app.use('/', loginUserRouter);
// app.use('/', projectRouter);
// app.use('/', categoryRouter);
// app.use('/', learningPathRouter);
// app.use('/', voucherRouter);
// app.use('/', syllabusRouter);
// app.use('/', reviewRouter);
// app.use('/', transactionRouter);
// app.use('/', learningRouter);
// app.use('/', activityRouter);
//
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
//
// // Expose Express API as a single Cloud Function:
// // exports.widgets = onRequest(app);
// module.exports = app;

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
// const { onRequest } = require("firebase-functions/v2/https");

const indexRouter = require("../routes/index");
const usersRouter = require("../routes/users");
const registerRouter = require("../routes/RegistrationUserRouter");
const loginUserRouter = require("../routes/LoginUserRouter");
const projectRouter = require("../routes/ProjectRouter");
const categoryRouter = require("../routes/CategoryRouter");
const learningPathRouter = require("../routes/LearningPathRouter");
const voucherRouter = require("../routes/VoucherRouter");
const syllabusRouter = require("../routes/SyllabusRouter");
const reviewRouter = require("../routes/ReviewRouter");
const transactionRouter = require("../routes/TransactionRouter");
const learningRouter = require("../routes/LearningRouter");
const activityRouter = require("../routes/ActivityRouter");

const app = express();

// if (!process.env.FUNCTIONS_EMULATOR) {
//   app.listen(process.env.PORT || 8080, () => {
//     console.log(`Server is running on port ${process.env.PORT || 8080}`);
//   });
// }

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

// Expose Express API as a single Cloud Function:
// exports.widgets = onRequest(app);
module.exports = app;

