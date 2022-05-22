const router = require('express').Router();
const {
  getUsers, getUser, /* createUser, */ getUserMe, updateUser, updateAvatar,
} = require('../controllers/users');
const { userValidation, avatarValidation, userIdValidation } = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getUserMe);
router.get('/:id', userIdValidation, getUser);
// router.post('/', createUser);
router.patch('/me', userValidation, updateUser);
router.patch('/me/avatar', avatarValidation, updateAvatar);

module.exports = router;
