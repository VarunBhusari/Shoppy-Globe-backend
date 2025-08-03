const express = require('express')
const {
    addToCart,
    updateCartItem,
    removeCartItem,
    getCartItems,
} = require('../controllers/cartController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// All cart routes protected
router.use(authMiddleware)

router.get('/cart', getCartItems)
router.post('/cart', addToCart)
router.put('/cart/:id', updateCartItem)
router.delete('/cart/:id', removeCartItem)

module.exports = router
