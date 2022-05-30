const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const { authorizationValidation, registrationValidation } = require('./middlewares/validation');
const { auth } = require('./middlewares/auth');
const routes = require('./routes');
const serverError = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();
app.use(bodyParser.json());

// роуты, не требующие авторизации - регистрация и логин
app.post('/signup', registrationValidation, createUser);
app.post('/signin', authorizationValidation, login);

// авторизация
app.use(auth);

app.use(requestLogger); // подключаем логгер запросов

app.use(routes);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());
app.use(serverError);

mongoose.connect('mongodb://localhost:27017/mestodb', () => {
  // eslint-disable-next-line no-console
  console.log('Подключение успешно');
});

app.listen(PORT, () => {
// Если всё работает, консоль покажет, какой порт приложение слушает
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
