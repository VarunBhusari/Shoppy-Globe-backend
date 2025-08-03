const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')

exports.register = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })

    const { username, email, password } = req.body
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser)
            return res.status(400).json({ message: 'Email already registered' })

        const hashedPassword = await bcrypt.hash(password, 12)
        const newUser = new User({ username, email, passwordHash: hashedPassword })
        await newUser.save()
        res.status(201).json({ message: 'User registered successfully' })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
}

exports.login = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() })

    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: 'Invalid credentials' })

        const isMatch = await bcrypt.compare(password, user.passwordHash)
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.TOKEN_EXPIRY || '1d' }
        )
        res.json({ token })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
}
