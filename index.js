/*
 *
 *
 ------->Title: index file 
 ->Description: this is index file for practicing chat application
 ------>Author: Shawon Talukder
 -------->Date: 01/04/2023
 *
 *
 */

//dependencies
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const moment = require("moment");
const http = require("http");
const { Server } = require("socket.io");

//internal dependencies
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/common/errorHandler");
const loginRouter = require("./routes/loginRouter");
const userRouter = require("./routes/userRouter");
const inboxRouter = require("./routes/inboxRouter");

//model structure
const app = express();
const server = http.createServer(app);
dotenv.config();

//socket creation
const io = new Server(server);
global.io = io;

//set moment as local variable
app.locals.moment = moment;

//database connection
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => console.log("Database connected successfully!"))
  .catch((err) => console.log(err));

//request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//set view engine
app.set("view engine", "ejs");

//set static folder
app.use(express.static(path.join(__dirname, "public")));

//cookie parse
app.use(cookieParser(process.env.COOKIE_SECRET));

//routing setup
app.use("/", loginRouter);
app.use("/users", userRouter);
app.use("/inbox", inboxRouter);

//error handling
//not found error handling
app.use(notFoundHandler);
//default error handling
app.use(errorHandler);

//server listen
app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
