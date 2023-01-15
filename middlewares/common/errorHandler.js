const createError = require("http-errors");

//404 not found handler
const notFoundHandler = (req, res, next) => {
  next(createError(404, "Your requested content was not found!"));
};

//default error handler
const errorHandler = (err, req, res, next) => {
  res.locals.error =
    process.env.NODE_ENV.trim() === "development"
      ? err
      : { message: err.message };
  res.status(err.status || 500);

  if (res.locals.html) {
    //send html response
    res.render("error", {
      title: "TheError",
    });
  } else {
    res.json(res.locals.error);
  }
};

//export handlers
module.exports = {
  notFoundHandler,
  errorHandler,
};
