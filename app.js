require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
app.use('/uploads', express.static('uploads'))
const routes = require('./routes');
const logger = require('./middlewares/logger.js')
app.use(morgan('dev'));
const PORT = process.env.SERVER_PORT;

//cors 
app.use(
  cors({
    origin: '*', //origin 확인 필요
    credentials: true,
    optionsSuccessStatus: 200,
    exposedHeaders: ['Authorization'], //클라이언트가 응답에서 액세스할 수 있는 헤더 목록
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false })); // x-www-form-urlencoded형태의 데이터 해설
app.use(cookieParser());
app.use('/', routes);

// 에러 핸들러
app.use((err, req, res, next) => {
  logger.error(err.stack)
  return res.status(err.output.payload.statusCode || 500).json({
    errorMessage: err.output.payload.message || '서버 에러가 발생했습니다.',
  });
});

app.get('/', (req, res) => {
  res.send('Netflix');
});

app.listen(PORT, () => {
  logger.info(`${PORT} 포트 번호로 서버가 실행되었습니다.`);
});

module.exports = app;
