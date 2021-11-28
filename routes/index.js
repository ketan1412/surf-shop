const express = require('express');
const router = express.Router();
const multer=require('multer');
const { storage }=require('../cloudinary');
const upload=multer({ storage });
const { updateProfile, getRegister, postRegister, getLogin, postLogin, getLogout, landingPage, getProfile, getForgotPw, putForgotPw, getReset, putReset }=require('../controllers/index');
const { asyncErrorHandler, isLoggedIn, isValidPassword, changePassword }=require('../middleware/index');

/* GET home/landing page page. */
router.get('/', asyncErrorHandler(landingPage));

/* GET register. */
router.get('/register', getRegister);

/* Post register. */
router.post('/register', upload.single('image'), asyncErrorHandler(postRegister));

/* Get Login. */
router.get('/login', getLogin);

/* Post Login. */
router.post('/login',asyncErrorHandler(postLogin));

/* GET logout*/
router.get('/logout',getLogout);

/* Get Profile. */
router.get('/profile', isLoggedIn, asyncErrorHandler(getProfile));

/* Put profile */
router.put('/profile/', isLoggedIn, upload.single('image'), asyncErrorHandler(isValidPassword), asyncErrorHandler(changePassword),asyncErrorHandler(updateProfile));

/* Get forgot-pw. */
router.get('/forgot-password', getForgotPw);

/* Put forgot-pw. */
router.put('/forgot-password', asyncErrorHandler(putForgotPw));

/* Get reset-pw. */
router.get('/reset/:token', asyncErrorHandler(getReset));

/* Put reset-pw. */
router.put('/reset/:token', asyncErrorHandler(putReset));

module.exports = router;
