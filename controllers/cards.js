const Cards = require('../models/card');

const getCards = (req, res) => Cards.find({})
  .then((cards) => res.status(200).send(cards));

const createCard = (req, res) => {
  const { name, link } = req.body;

  return Cards.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card));
};

const deleteCard = (req, res) => Cards.findByIdAndRemove(req.params.id)
  .then((cards) => res.status(200).send(cards));

const likeCard = (req, res) => Cards.findByIdAndUpdate(
  req.params.id,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => res.status(200).send(card));

const dislikeCard = (req, res) => Cards.findByIdAndUpdate(
  req.params.id,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => res.status(200).send(card));

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
