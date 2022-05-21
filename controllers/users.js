const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConcflictError');
// const AuthError = require('../errors/ConcflictError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

const getUser = (req, res, next) => {
  const { id } = req.params;
  return User.findById(id)
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные');
      } else if (err.name === 'NotFoundError') {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
    })
    .catch(next);
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
        throw new ValidationError('Переданы некорректные данные при создании пользователя');
      } else if (err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже существует');
      }
    })
    .catch(next);
};

/* const getUserMe = (req, res, next) => User.findById(req.user._id)
  .orFail(() => {
    throw new NotFoundError('Пользователь по указанному _id не найден');
  })
  .then((user) => res.status(200).send({ data: user }))
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new ValidationError('Переданы некорректные данные');
    } else if (err.name === 'NotFoundError') {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    }
  })
  .catch(next); */

const getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name = req.params.name, about = req.params.about } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь с указанным _id не найден');
    })
    .then((user) => res.status(200).send({ name: user.name, about: user.about }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные при обновлении профиля');
      }
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь с указанным _id не найден');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные при обновлении аватара');
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      // вернём токен
      res.send({ token });
    }) // аутентификация успешна! пользователь в переменной user
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  getUserMe,
  updateUser,
  updateAvatar,
  login,
  // JWT_SECRET,
};

// const { JWT_SECRET = 'some-secret-key' } = process.env;
// const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line max-len
/* const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
  expiresIn: '7d',
}); */
// const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

/* .catch(() => {
  next(new AuthError('В доступе отказано'));
}); */
