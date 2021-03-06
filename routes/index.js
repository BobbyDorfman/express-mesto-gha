const router = require('express').Router();
// Где-то ЗДЕСЬ ошибка тянется с get
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const NotFoundError = require('../errors/NotFoundError');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
/* router.get('/', (req, res) => {
  res.send('Ответ на сигнал из далёкого космоса');
}); */
router.use((req, res, next) => {
  next(new NotFoundError('Ресурс не найден'));
});

module.exports = router;
