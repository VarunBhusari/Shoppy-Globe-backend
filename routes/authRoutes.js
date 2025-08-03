const express = require('express')
const { body } = require('express-validator')
const { register, login } = require('../controllers/authController')

const router = express.Router()

router.post(
    '/register',
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Valid email required'),
        body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
    ],
    register
)

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Valid email required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    login
)

module.exports = router
