import * as http from 'http';
import createError from 'http-errors';
import express, { ErrorRequestHandler } from 'express';

import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes';

const cors = require('cors');
const app = express();
const port = process.env.PORT || '8000';
const whiteList = ['http://localhost:3000', 'https://www.wordssay.com'];

app.use(
  cors({
    origin: function (origin: string, callback: any) {
      const isSafeOrigin = whiteList.indexOf(origin) !== -1;
      callback(null, isSafeOrigin);
    },
    credentials: true,
  }),
);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  res.json(err);
};
app.use(errorHandler);

app.set('port', port);

const server = http.createServer(app);

app.listen(port, () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
  console.log('Listening on ' + bind);
});

export default app;
