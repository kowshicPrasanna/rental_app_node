var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const dotenv = require("dotenv").config();
const config = require("./config");
const { authorizer } = require("./lib/authorizer");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var vehicleownerRouter = require("./routes/vehicleowner");
var vehiclerRouter = require("./routes/vehicle");
var PaymentRouter = require("./routes/payment");
var ProfileRouter = require("./routes/profile");
var ReviewRouter = require("./routes/review");
var BookingRouter = require("./routes/booking");
var SmsRouter = require("./routes/sms");
const cors = require("cors");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static("uploads"));
app.use(
  cors({
    origin: "*",
  })
);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/vehicleowner", vehicleownerRouter);
app.use("/vehicle", vehiclerRouter);
app.use("/payment", PaymentRouter);
app.use("/profile", ProfileRouter);
app.use("/review", ReviewRouter);
app.use("/booking", BookingRouter);
app.use("/sms", SmsRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
