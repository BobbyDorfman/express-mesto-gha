const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const routes = require('./routes');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '627d5bf85bd40126340521bc',
  };

  next();
});

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

// 627d5bf85bd40126340521bc