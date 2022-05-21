const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { ERROR_CODE, ERROR_NOT_FOUND, ERROR_DEFAULT } = require('../middlewares/errors');

// eslint-disable-next-line arrow-body-style
const getUsers = (req, res) => {
  return User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' }));
};

const getUser = (req, res) => {
  const { id } = req.params;
  return User.findById(id)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else if (err.code === 11000) {
        res.status(409).send({ message: 'Пользователь с таким email уже существует' });
      }
    })
    .catch(next);
};

const getUserMe = (req, res) => User.findById(req.user._id)
  .orFail(() => {
    throw new Error('NotFound');
  })
  .then((user) => res.status(200).send({ data: user }))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
    } else if (err.message === 'NotFound') {
      res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
    } else {
      res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
    }
  });

const updateUser = (req, res) => {
  const { name = req.params.name, about = req.params.about } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.status(200).send({ name: user.name, about: user.about }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else if (err.message === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else if (err.message === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
      }
    });
};

const { SECRET_CODE = '$2a$10$CkMBWD/MuJ5GyIbzDS1v/.iO2muX9PWBbvvqyOvR0a6MJzmg6lP32' } = process.env;

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, SECRET_CODE, { expiresIn: '7d' });
      // const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      // вернём токен
      res.send({ token });
    }) // аутентификация успешна! пользователь в переменной user
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  getUserMe,
  updateUser,
  updateAvatar,
  login,
};
