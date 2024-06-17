const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const {createUserValidator, validateCreateUser} = require('../middlewares/validateCreateUser');
const authenticatedToken = require('../middlewares/authMiddleware');
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
router.get('/',authenticatedToken, userController.getAllUsers);
router.get('/:id',authenticatedToken, userController.getUserById);
router.patch('/edit/:id',authenticatedToken, upload.single('avatar'), userController.updateUser);
router.delete('/remove/:id', authenticatedToken, userController.deleteUser);

module.exports = router;