const decorateHTMLResponse = (page_title) => {
  return function (req, res, next) {
    res.locals.html = true;
    res.locals.title = `${page_title} - ${process.env.APP_NAME}`;
    res.locals.errors = {};
    res.locals.loggedInUser = {};
    res.locals.data = {};
    next();
  };
};

//export the module
module.exports = decorateHTMLResponse;
