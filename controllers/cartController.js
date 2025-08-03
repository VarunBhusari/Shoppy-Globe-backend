const CartItem = require('../models/CartItem')
const Product = require('../models/Product')

exports.addToCart = async (req, res) => {
    const userId = req.user.id
    const { productId, quantity } = req.body

    if (!productId || quantity < 1)
        return res.status(400).json({ message: 'Invalid input' })

    try {
        const product = await Product.findById(productId)
        if (!product) return res.status(404).json({ message: 'Product not found' })
        if (product.stockQuantity < quantity) return res.status(400).json({ message: 'Insufficient stock' })

        let cartItem = await CartItem.findOne({ userId, productId })
        if (cartItem) {
            cartItem.quantity += quantity
            await cartItem.save()
        } else {
            cartItem = new CartItem({ userId, productId, quantity })
            await cartItem.save()
        }
        return res.status(201).json(cartItem)
    } catch (err) {
        return res.status(500).json({ message: 'Failed to add to cart' })
    }
}

exports.updateCartItem = async (req, res) => {
    const userId = req.user.id
    const cartItemId = req.params.id
    const { quantity } = req.body

    if (quantity < 1)
        return res.status(400).json({ message: 'Quantity must be at least 1' })

    try {
        let cartItem = await CartItem.findOne({ _id: cartItemId, userId })
        if (!cartItem)
            return res.status(404).json({ message: 'Cart item not found' })

        const product = await Product.findById(cartItem.productId)
        if (!product) return res.status(404).json({ message: 'Product not found' })
        if (product.stockQuantity < quantity) return res.status(400).json({ message: 'Insufficient stock' })

        cartItem.quantity = quantity
        await cartItem.save()

        res.json(cartItem)
    } catch (err) {
        res.status(500).json({ message: 'Failed to update cart item' })
    }
}

exports.removeCartItem = async (req, res) => {
    const userId = req.user.id
    const cartItemId = req.params.id

    try {
        const cartItem = await CartItem.findOneAndDelete({ _id: cartItemId, userId })
        if (!cartItem)
            return res.status(404).json({ message: 'Cart item not found' })
        res.json({ message: 'Cart item removed' })
    } catch (err) {
        res.status(500).json({ message: 'Failed to remove cart item' })
    }
}

exports.getCartItems = async (req, res) => {
    const userId = req.user.id
    try {
        const items = await CartItem.find({ userId }).populate('productId')
        res.json(items)
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch cart items' })
    }
}
