var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const accountRouter = require('./routes/account')
const consultationRouter = require('./routes/consultation')
require('dotenv').config()
const db = require('./models/index');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger.json');
const chalk = require('chalk')
var app = express();
 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/healthchek', indexRouter);
app.use('/users', usersRouter);
app.use('/account', accountRouter);
app.use('/consultations', consultationRouter);

db.sequelize
.sync()
.then(() => {
console.log(chalk.white.bgMagenta.bold(`CROP-SENSE connected with postgres : 🌴🌴🌴`,));
app.listen(process.env.PORT, () => {
console.log(chalk.white.bgGreen.bold(`CROP-SENSE server running at : ${process.env.PORT} 🚀🚀🚀 `));
});
})
.catch(error => {
console.log(error);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next)=>{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});



module.exports = app;
