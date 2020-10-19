var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const JWT = require('./utils/jwt')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const accountRouter = require('./routes/account')
const consultationRouter = require('./routes/consultation')
// require('dotenv').config()
const db = require('./models/index');
const account = require('./controllers/account');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger.json');
// const config = require(__dirname + '/../config/config.js');

var app = express();
 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/account', async (req, res, next) => {
//   if (req.headers['authorization']) {
//     var token = req.headers['authorization']
//     if (token.startsWith('Bearer ')) {
//       token = token.slice(7, token.length);
//       let verifyDetails = JWT.verifyToken(token, req, res, next);
//       console.log(verifyDetails); 
//       if (verifyDetails.email) {
//         req["user"] = verifyDetails
//         next();
//       } else {
//         res.status(403).send({ "error": { status: 403, message: "UnAuthorized Access" } });
//       }
//     }
//   } else {
//     req.user = { role: "public" }
//     next();
//   }
// }, accountRouter)

// accountRouter.routesConfig(app);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/account', accountRouter);
app.use('/consultations', consultationRouter);

db.sequelize
.sync()
.then(() => {
app.listen(process.env.PORT, () => {
console.log(`🚀🚀🚀 CROP-SENCE Secure, server up and running 🚀🚀🚀`);
// console.log(`server started in ${process.env.NODE_ENV} environment`)
});
})
.catch(error => {
console.log('Error connecting to DB', error);
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
