const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  about: {
    type: String, // информация о пользователе — это строка
    required: true, // должна быть у каждого пользователя — обязательное поле
    minlength: 2, // минимальная длина — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  avatar: {
    type: String, // аватар — это строка
    required: true,
    // default: 'https://images.unsplash.com/photo-1578133507770-a35cc3c786e6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
