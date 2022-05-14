const Cards = require('../models/card');
const { ERROR_CODE, ERROR_NOT_FOUND, ERROR_DEFAULT } = require('../utils/errors');

const getCards = (req, res) => Cards.find({})
  .then((cards) => res.status(200).send(cards))
  .catch(() => {
    res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
  });

const createCard = (req, res) => {
  const { name, link } = req.body;

  return Cards.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
      }
    });
};

const deleteCard = (req, res) => Cards.findByIdAndRemove(req.params.id)
  .orFail(() => {
    throw new Error('NotFound');
  })
  .then((cards) => res.status(200).send(cards))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
    } else if (err.message === 'NotFound') {
      res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
    } else {
      res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
    }
  });

const likeCard = (req, res) => Cards.findByIdAndUpdate(
  req.params.id,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .orFail(() => {
    throw new Error('NotFound');
  })
  .then((card) => res.status(200).send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
    } else if (err.message === 'NotFound') {
      res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
    } else {
      res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
    }
  });

const dislikeCard = (req, res) => Cards.findByIdAndUpdate(
  req.params.id,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .orFail(() => {
    throw new Error('NotFound');
  })
  .then((card) => res.status(200).send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
    } else if (err.message === 'NotFound') {
      res.status(ERROR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
    } else {
      res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
    }
  });

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
