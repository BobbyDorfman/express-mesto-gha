const router = require('express').Router();
// Где-то ЗДЕСЬ ошибка тянется с get
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { ERROR_NOT_FOUND } = require('../middlewares/errors');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.get('/', (req, res) => {
  res.send('Ответ на сигнал из далёкого космоса');
});
router.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: `Ресурс по адресу "${req.path}" не найден` });
});

module.exports = router;
