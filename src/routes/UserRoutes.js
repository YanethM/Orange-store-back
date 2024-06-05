const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const {createUserValidator, validateCreateUser} = require('../middlewares/validateCreateUser');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/users");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage });

router.post('/new-user', upload.single('avatar'), createUserValidator, validateCreateUser, userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.patch('/edit/:id', upload.single('avatar'), userController.updateUser);
router.delete('/remove/:id', userController.deleteUser);

module.exports = router;