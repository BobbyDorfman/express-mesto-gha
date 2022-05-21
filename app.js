const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes');
const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();
app.use(bodyParser.json());

// роуты, не требующие авторизации,
// регистрация и логин
app.post('/signup', createUser);
app.post('/signin', login);

// авторизация
app.use(auth);

app.use(routes);

mongoose.connect('mongodb://localhost:27017/mestodb', () => {
  // eslint-disable-next-line no-console
  console.log('Подключение успешно');
});

app.listen(PORT, () => {
// Если всё работает, консоль покажет, какой порт приложение слушает
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
