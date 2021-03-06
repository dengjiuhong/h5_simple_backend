var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
const compression = require('compression');

// 连接MongoDB
var app = express();
app.engine('html', ejs.__express);
app.use(compression());
// app.use(express.static('./views', {
//     maxAge: 864000  // one day
// }));
// var uuid = require('node-uuid');
// var sprintf = require("sprintf-js").sprintf;
var mongoClient = require('mongodb').MongoClient;
var url = "";
// var url = "mongodb://localhost";
console.log("ready to connect!");
mongoClient.connect(url, function(err, db) {
    if(err) {
        console.error("connect err:", err);
        return 1;
    }
    console.log("connect!");
    var index = require('./routes/index')(db);
    
    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'html');
    
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    
    // uncomment after placing your favicon in /public
    // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    // app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    
    app.use('/', index);
    
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });
    
    // error handler
    app.use(function(err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
    //   console.log(err);
      // render the error page
      res.sendStatus(err.status || 500);
    //   res.render('error');
    });
    console.log("end!");
});
module.exports = app;
