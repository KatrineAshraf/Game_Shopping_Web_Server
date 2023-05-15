var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const ejs = require('ejs')
var bodyParser = require('body-parser')
var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/customers');
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false })
// view engine setup
app.use('/', indexRouter);
//app.use('/users', usersRouter);

var jsonParser = bodyParser.json()

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var server = app.listen(3000, function () {
  var port = server.address().port
  console.log("Example app listening at http://localhost:%s/",  port)
})

app.get('/', function(req, res) {
  res.render('index');
});

module.exports = app;