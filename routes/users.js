const router = require('express').Router();
const {
  getUsers, getUser, createUser, getUserMe, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getUser);
router.get('/me', getUserMe);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
