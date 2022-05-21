const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new AuthError('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};

// const { JWT_SECRET } = require('../controllers/users');
// const { NODE_ENV, JWT_SECRET } = process.env;

// payload = jwt.verify(token, JWT_SECRET);
// payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
